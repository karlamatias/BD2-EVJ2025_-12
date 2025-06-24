const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");
const client = require("prom-client");
const { v4: uuidv4 } = require("uuid");

const {
  register,
  apiRequestsTotal,
  apiRequestDuration,
  userRegistrationsTotal,
  gamesCreatedTotal,
  reviewsTotal,
} = require("./metrics");

const app = express();

app.use(cors());
app.use(express.json());

// Middleware para contar y medir duración de solicitudes
app.use((req, res, next) => {
  const end = apiRequestDuration.startTimer({
    method: req.method,
    endpoint: req.path,
  });
  res.on("finish", () => {
    apiRequestsTotal.inc({ method: req.method, endpoint: req.path });
    end();
  });
  next();
});

// Redis client conexión
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redisClient = createClient({ url: redisUrl });

redisClient
  .connect()
  .then(() => console.log("Redis conectado"))
  .catch(console.error);

// --- Endpoints ---

// Crear usuario
app.post("/users", async (req, res) => {
  const id = uuidv4();
  const { username, email, password_hash, role } = req.body;
  if (!username || !email || !password_hash || !role) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  await redisClient.hSet(`user:${id}`, {
    username,
    email,
    password_hash,
    role,
  });

  // Incrementar métrica userRegistrationsTotal
  userRegistrationsTotal.inc();

  res.json({ id });
});

// Listar usuarios
app.get("/users", async (req, res) => {
  const keys = await redisClient.keys("user:*");
  const users = [];
  for (const key of keys) {
    const user = await redisClient.hGetAll(key);
    users.push({ id: key.split(":")[1], ...user });
  }
  res.json(users);
});

// Delete usuario
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const key = `user:${id}`;

  try {
    const exists = await redisClient.exists(key);

    if (!exists) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await redisClient.del(key);
    res.json({ message: `Usuario con ID ${id} eliminado` });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Crear Juegos
app.post("/games", async (req, res) => {
  const id = uuidv4();
  const { titulo, descripcion, genero, desarrollador } = req.body;
  if (!titulo || !descripcion || !genero || !desarrollador) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  await redisClient.hSet(`game:${id}`, {
    titulo,
    descripcion,
    genero,
    desarrollador,
  });

  // Incrementar métrica gamesCreatedTotal
  gamesCreatedTotal.inc();

  res.json({ id });
});

// Listar juegos
app.get("/games", async (req, res) => {
  const keys = await redisClient.keys("game:*");
  const games = [];
  for (const key of keys) {
    const game = await redisClient.hGetAll(key);
    games.push({ id: key.split(":")[1], ...game });
  }
  res.json(games);
});

// Delete games
app.delete("/games/:id", async (req, res) => {
  const { id } = req.params;
  const key = `game:${id}`;

  try {
    const exists = await redisClient.exists(key);

    if (!exists) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }

    await redisClient.del(key);
    res.json({ message: `Juego con ID ${id} eliminado` });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password_hash } = req.body;
  if (!email || !password_hash) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  // Buscar todos los usuarios
  const keys = await redisClient.keys("user:*");
  for (const key of keys) {
    const user = await redisClient.hGetAll(key);
    if (user.email === email && user.password_hash === password_hash) {
      return res.json({
        id: key.split(":")[1],
        username: user.username,
        role: user.role,
      });
    }
  }

  return res.status(401).json({ error: "Credenciales inválidas" });
});

// Endpoint para exponer métricas a Prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");
const client = require("prom-client");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

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

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});

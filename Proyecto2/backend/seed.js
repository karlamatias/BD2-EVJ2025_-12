import { createClient } from "redis";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const SALT_ROUNDS = 10;
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

await redisClient.connect();

const hashPassword = (pwd) => bcrypt.hash(pwd, SALT_ROUNDS);

async function seed() {
  console.log("Seeding Redis with test data...");

  // Admin
  const adminId = uuidv4();
  const adminPwd = await hashPassword("admin");
  await redisClient.hSet(`user:${adminId}`, {
    username: "admin",
    email: "admin@adm.com",
    password_hash: adminPwd,
    role: "admin"
  });

  // Users
  const users = [];
  for (let i = 1; i <= 3; i++) {
    const id = uuidv4();
    const pwd = await hashPassword(`user${i}`);
    await redisClient.hSet(`user:${id}`, {
      username: `usuario${i}`,
      email: `user${i}@u.com`,
      password_hash: pwd,
      role: "user"
    });
    users.push({ id, username: `usuario${i}` });
  }

  // Games
  const games = [];
  const gameTemplates = [
    {
      titulo: "Hollow Knight",
      descripcion: "An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style.",
      genero: "Aventura",
      desarrollador: "Team Cherry",
      plataformas: "PC, PS5",
      fecha_lanzamiento: "2023-10-01",
      clasificacion_edad: "12+",
      imagen_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgEYdEMxwc6EOw5LhEmnQy0x6_Y5cnxgSa_Q&s"
    },
    {
      titulo: "Pokémon Red & Blue",
      descripcion: "The Pokémon series started life in Japan as Pocket Monsters: Red and Pocket Monsters: Green. After it became popular the games were released to an international audience as Pokémon Red and Pokémon Blue where they quickly achieved massive success.",
      genero: "RPG",
      desarrollador: "Nintendo",
      plataformas: "Game boy",
      fecha_lanzamiento: "1996-02-27",
      clasificacion_edad: "10+",
      imagen_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOM6fy_MtZmANroNMjhZ8ZavTRBf4rS8F8kQ&s"
    },
    {
      titulo: "Children of the Sun",
      descripcion: "On a deadly road trip into darkness, control the path of a single bullet and unleash a fury of vengeance on the sinister cult that ruined your life in this tactical puzzle-shooter.",
      genero: "Acción, Estrategia",
      desarrollador: "René Rother",
      plataformas: "Xbox, PC",
      fecha_lanzamiento: "2024-04-09",
      clasificacion_edad: "10+",
      imagen_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1309950/header.jpg?t=1745814512"
    },
    {
      titulo: "Outer Wilds",
      descripcion: "On a deadly road trip into darkness, control the path of a single bullet and unleash a fury of vengeance on the sinister cult that ruined your life in this tactical puzzle-shooter.",
      genero: "Acción, Estrategia",
      desarrollador: "René Rother",
      plataformas: "Xbox, PC",
      fecha_lanzamiento: "2024-04-09",
      clasificacion_edad: "10+",
      imagen_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1309950/header.jpg?t=1745814512"
    },
    {
      titulo: "Stray",
      descripcion: "Lost, alone and separated from family, a stray cat must untangle an ancient mystery to escape a long-forgotten cybercity and find their way home.",
      genero: "Aventura",
      desarrollador: "BlueTwelve Studio",
      plataformas: "Xbox, PC",
      fecha_lanzamiento: "2022-07-19",
      clasificacion_edad: "10+",
      imagen_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1332010/header.jpg?t=1733260906"
    },
    {
      titulo: "Stardew Valley",
      descripcion: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home? ",
      genero: "Simulador de granja",
      desarrollador: "ConcernedApe",
      plataformas: "Xbox, PC",
      fecha_lanzamiento: "2016-02-26",
      clasificacion_edad: "10+",
      imagen_url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg?t=1711128146"
    }
  ];

  for (const template of gameTemplates) {
    const id = uuidv4();
    await redisClient.hSet(`game:${id}`, template);
    games.push({ id, titulo: template.titulo });
  }

  // Reseñas
  for (const game of games) {
    for (const user of users) {
      const reviewId = uuidv4();
      await redisClient.hSet(`review:${reviewId}`, {
        game_id: game.id,
        user_id: user.id,
        score: Math.floor(Math.random() * 10) + 2,
        comment: `¡Me encantó ${game.titulo}!`,
        timestamp: Date.now().toString()
      });
    }
  }

  console.log("Datos insertados correctamente.");
  await redisClient.quit();
}

seed().catch((err) => {
  console.error("Error al insertar datos:", err);
  redisClient.quit();
});

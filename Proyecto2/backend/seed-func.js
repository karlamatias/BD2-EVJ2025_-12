const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const {
  userRegistrationsTotal,
  gamesCreatedTotal,
  reviewsTotal,
} = require("./metrics");

const SALT_ROUNDS = 10;

const comentarios = [
  (title) => `¡Me encantó ${title}! Muy recomendable.`,
  (title) => `${title} tiene una jugabilidad excelente.`,
  (title) => `No esperaba mucho de ${title}, pero me sorprendió.`,
  (title) => `${title} tiene gráficos increíbles.`,
  (title) => `La historia de ${title} es envolvente.`,
  (title) => `Podría jugar ${title} una y otra vez.`,
  (title) => `${title} no fue lo que esperaba, pero no está mal.`,
  (title) => `${title} tiene sus fallos, pero es disfrutable.`,
  (title) => `Una experiencia única con ${title}.`,
  (title) => `${title} me mantuvo entretenido por horas.`,
];

async function hashPassword(pwd) {
  return bcrypt.hash(pwd, SALT_ROUNDS);
}

async function runSeed(redisClient) {
  const users = [];
  const games = [];

  // Admin
  const adminId = uuidv4();
  const adminPwd = await hashPassword("admin");
  await redisClient.hSet(`user:${adminId}`, {
    username: "admin",
    email: "admin@adm.com",
    password_hash: adminPwd,
    role: "admin",
  });
  userRegistrationsTotal.inc();

  // Usuarios
  for (let i = 1; i <= 15; i++) {
    const id = uuidv4();
    const pwd = await hashPassword(`user${i}`);
    await redisClient.hSet(`user:${id}`, {
      username: `usuario${i}`,
      email: `user${i}@u.com`,
      password_hash: pwd,
      role: "user",
    });
    users.push({ id, username: `usuario${i}` });
    userRegistrationsTotal.inc();
  }

  // Juegos
  const gameTemplates = [
    {
      titulo: "Hollow Knight",
      descripcion:
        "An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style.",
      genero: "Aventura",
      desarrollador: "Team Cherry",
      plataformas: "PC, PS5",
      fecha_lanzamiento: "2023-10-01",
      clasificacion_edad: "12+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg?t=1695270428",
    },
    {
      titulo: "Elden ring",
      descripcion:
        "THE CRITICALLY ACCLAIMED FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between",
      genero: "Aventura",
      desarrollador: "FromSoftware Inc.",
      plataformas: "PC, PS5, Xbox",
      fecha_lanzamiento: "2023-10-01",
      clasificacion_edad: "12+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1748630546",
    },
    {
      titulo: "ICARUS",
      descripcion:
        "ICARUS is a PvE survival game for up to eight players. Explore a savage wilderness in the aftermath of terraforming gone wrong. Survive the Open World, complete timed Missions or build your Outpost. Explore, build, craft and hunt while seeking your fortune and prospecting for exotic matter.",
      genero: "Supervivencia",
      desarrollador: "RocketWerkz",
      plataformas: "PC, PS5, Xbox",
      fecha_lanzamiento: "2021-12-03",
      clasificacion_edad: "12+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1149460/header.jpg?t=1737051079",
    },
    {
      titulo: "7 Days to Die",
      descripcion:
        "7 Days to Die is an open-world game that is a unique combination of first-person shooter, survival horror, tower defense, and role-playing games. Play the definitive zombie survival sandbox RPG that came first. Navezgane awaits! ",
      genero: "Supervivencia",
      desarrollador: "The Fun Pimps",
      plataformas: "PC, PS5, Xbox",
      fecha_lanzamiento: "2024-07-25",
      clasificacion_edad: "12+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/251570/header.jpg?t=1750884786",
    },
    {
      titulo: "Terraria",
      descripcion:
        "Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game. Four Pack also available! ",
      genero: "Supervivencia",
      desarrollador: "The Fun Pimps",
      plataformas: "PC, PS5, Xbox",
      fecha_lanzamiento: "2024-07-25",
      clasificacion_edad: "12+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg?t=1731252354",
    },
    {
      titulo: "It takes two",
      descripcion:
        "Embark on the craziest journey of your life in It Takes Two. Invite a friend to join for free with Friend’s Pass and work together across a huge variety of gleefully disruptive gameplay challenges. Winner of GAME OF THE YEAR at the Game Awards 2021",
      genero: "Multijugador",
      desarrollador: "Hazelight Studios",
      plataformas: "PC, PS5, Xbox",
      fecha_lanzamiento: "2031-03-25",
      clasificacion_edad: "12+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg?t=1749142249",
    },
    {
      titulo: "Little Nightmares",
      descripcion:
        "Take on the role of Six, a lone child lost in a massive metal vessel known as the Maw, surrounded by dangerous, distorted versions of adults. You’ll need to do your best to escape in one piece or your fate will be worse than you ever dared dream. ",
      genero: "Horror",
      desarrollador: "Tarsier Studios",
      plataformas: "PC, PS5, Xbox",
      fecha_lanzamiento: "2017-04-27",
      clasificacion_edad: "12+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/424840/header.jpg?t=1730127751",
    },
    {
      titulo: "Palia",
      descripcion:
        "Discover a welcoming world in Palia, a free-to-play fantasy life sim adventure where you can craft, explore, and create the life and home of your dreams. With nearly endless ways to make Palia your home, you’ll find relaxation and joy in every corner of this vibrant, heartwarming world. ",
      genero: "Multijugador",
      desarrollador: "Singularity 6 Corporation",
      plataformas: "PC, PS5, Xbox",
      fecha_lanzamiento: "2024-03-25",
      clasificacion_edad: "12+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2707930/b083c84354a491693c46203f64e25eaaf7b78356/header.jpg?t=1747075758",
    },
    {
      titulo: "Sky: Children of the Light",
      descripcion:
        "Sky: Children of the Light is a peaceful, award-winning MMO from the creators of Journey. Explore a beautifully-animated kingdom across seven realms and create enriching memories with other players in this delightful puzzle-adventure game. ",
      genero: "Multijugador",
      desarrollador: "thatgamecompany",
      plataformas: "PC, PS5, Xbox",
      fecha_lanzamiento: "2024-04-10",
      clasificacion_edad: "12+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2325290/header.jpg?t=1745279014",
    },
    {
      titulo: "Unravel Two",
      descripcion:
        "When you cut ties to the past, new bonds form. Build relationships with other Yarnys in local co-op or as a single player, fostering friendship and support as you journey together. ",
      genero: "Multijugador",
      desarrollador: "Coldwood Interactive",
      plataformas: "PC, PS5, Xbox",
      fecha_lanzamiento: "2018-06-09",
      clasificacion_edad: "12+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1225570/header.jpg?t=1721053654",
    },
    {
      titulo: "Pokémon Red & Blue",
      descripcion:
        "The Pokémon series started life in Japan as Pocket Monsters: Red and Pocket Monsters: Green. After it became popular the games were released to an international audience as Pokémon Red and Pokémon Blue where they quickly achieved massive success.",
      genero: "RPG",
      desarrollador: "Nintendo",
      plataformas: "Game boy",
      fecha_lanzamiento: "1996-02-27",
      clasificacion_edad: "10+",
      imagen_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOM6fy_MtZmANroNMjhZ8ZavTRBf4rS8F8kQ&s",
    },
    {
      titulo: "Children of the Sun",
      descripcion:
        "On a deadly road trip into darkness, control the path of a single bullet and unleash a fury of vengeance on the sinister cult that ruined your life in this tactical puzzle-shooter.",
      genero: "Acción, Estrategia",
      desarrollador: "René Rother",
      plataformas: "Xbox, PC",
      fecha_lanzamiento: "2024-04-09",
      clasificacion_edad: "10+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1309950/header.jpg?t=1745814512",
    },
    {
      titulo: "Outer Wilds",
      descripcion:
        "On a deadly road trip into darkness, control the path of a single bullet and unleash a fury of vengeance on the sinister cult that ruined your life in this tactical puzzle-shooter.",
      genero: "Acción, Estrategia",
      desarrollador: "René Rother",
      plataformas: "Xbox, PC",
      fecha_lanzamiento: "2024-04-09",
      clasificacion_edad: "10+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/753640/header.jpg?t=1729097431",
    },
    {
      titulo: "Stray",
      descripcion:
        "Lost, alone and separated from family, a stray cat must untangle an ancient mystery to escape a long-forgotten cybercity and find their way home.",
      genero: "Aventura",
      desarrollador: "BlueTwelve Studio",
      plataformas: "Xbox, PC",
      fecha_lanzamiento: "2022-07-19",
      clasificacion_edad: "10+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1332010/header.jpg?t=1733260906",
    },
    {
      titulo: "Stardew Valley",
      descripcion:
        "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home? ",
      genero: "Simulador de granja",
      desarrollador: "ConcernedApe",
      plataformas: "Xbox, PC",
      fecha_lanzamiento: "2016-02-26",
      clasificacion_edad: "10+",
      imagen_url:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg?t=1711128146",
    },
  ];

  for (const template of gameTemplates) {
    const id = uuidv4();
    await redisClient.hSet(`game:${id}`, template);
    games.push({ id, titulo: template.titulo });
    gamesCreatedTotal.inc();
  }

  // Reseñas
  for (const game of games) {
    for (const user of users) {
      if (Math.random() < 0.3) {
        const reviewId = uuidv4();
        const commentFn =
          comentarios[Math.floor(Math.random() * comentarios.length)];
        const score = Math.floor(Math.random() * 9) + 2;

        await redisClient.hSet(`review:${reviewId}`, {
          game_id: game.id,
          user_id: user.id,
          score,
          comment: commentFn(game.titulo),
          timestamp: Date.now().toString(),
        });
        reviewsTotal.inc();
      }
    }
  }
}

module.exports = runSeed;

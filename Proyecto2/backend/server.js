const cors = require('cors');
const express = require('express');
const Redis = require('ioredis');

const app = express();
const redis = new Redis({ host: process.env.REDIS_HOST });

app.use(cors()); // Permitir todos los orígenes
//app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/api/reviews', async (req, res) => {
  const reviews = await redis.lrange('reviews', 0, -1);
  res.json(reviews.map(JSON.parse));
});

app.post('/api/reviews', express.json(), async (req, res) => {
  await redis.lpush('reviews', JSON.stringify(req.body));
  res.status(201).send('Review saved');
});

app.listen(3001, () => {
  console.log('Backend running on port 3001');
});

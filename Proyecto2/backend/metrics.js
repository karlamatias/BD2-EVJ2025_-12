const client = require("prom-client");

const register = new client.Registry();

// Métricas por defecto (CPU, memoria)
client.collectDefaultMetrics({ register });

// Métricas backend personalizadas:

// Contador total de solicitudes HTTP, con etiquetas para método y endpoint
const apiRequestsTotal = new client.Counter({
  name: "api_requests_total",
  help: "Total de solicitudes HTTP recibidas",
  labelNames: ["method", "endpoint"],
});

// Histograma para latencia de respuesta HTTP
const apiRequestDuration = new client.Histogram({
  name: "api_request_duration_seconds",
  help: "Duración de solicitudes HTTP en segundos",
  labelNames: ["method", "endpoint"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Contador total de nuevos usuarios registrados
const userRegistrationsTotal = new client.Counter({
  name: "user_registrations_total",
  help: "Total de nuevos usuarios registrados",
});

// Contador total de juegos creados
const gamesCreatedTotal = new client.Counter({
  name: "games_created_total",
  help: "Total de videojuegos añadidos",
});

// Contador total de reseñas creadas
const reviewsTotal = new client.Counter({
  name: "reviews_total",
  help: "Total de reseñas enviadas",
});

// Registrar todas las métricas en el registro
register.registerMetric(apiRequestsTotal);
register.registerMetric(apiRequestDuration);
register.registerMetric(userRegistrationsTotal);
register.registerMetric(gamesCreatedTotal);
register.registerMetric(reviewsTotal);

module.exports = {
  register,
  apiRequestsTotal,
  apiRequestDuration,
  userRegistrationsTotal,
  gamesCreatedTotal,
  reviewsTotal,
};

const express = require("express");
const cors = require("cors");
const conectar = require("./conexion");
const mongo_queries = require("./queries_mongo");

const app = express();
app.use(cors());
const port = 3001;

app.get("/consulta/:id", async (req, res) => {
  await handleQueryRequest(req, res);
});

app.get("/consulta/:id/:correlativo", async (req, res) => {
  await handleQueryRequest(req, res);
});


async function handleQueryRequest(req, res) {
  let db;
  try {
    db = await conectar(); 
    const col = db.collection("aspirantes");
    const queryId = parseInt(req.params.id); 
    const correlativo = req.params.correlativo; //correlativo de un aspirante

    const queryFunction = mongo_queries[queryId];

    if (queryFunction) {
      const result = await queryFunction(col, correlativo);
      res.json(result);
    } else {
      res.status(404).json({ error: "Consulta no encontrada. ID de consulta inválido." });
    }
  } catch (error) {
    console.error(`Error al ejecutar la consulta ${req.params.id}:`, error);
    res.status(500).json({ error: "Error interno del servidor al procesar la consulta.", details: error.message });
  }
}

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

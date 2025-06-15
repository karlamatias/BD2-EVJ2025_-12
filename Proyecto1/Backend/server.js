const express = require("express");
const cors = require("cors");
const conectar = require("./conexion");

const app = express();
app.use(cors());
const port = 3001;

app.get("/consulta/:id", async (req, res) => {
  const db = await conectar();
  const col = db.collection("aspirantes");
  const id = parseInt(req.params.id);
  let result;

  try {
    switch (id) {
      case 1:
        // Aspirantes por tipo de institución educativa
        result = await col
          .aggregate([
            {
              $group: {
                _id: "$tipo_institucion_educativa",
                total_aspirantes: { $sum: 1 },
              },
            },
          ])
          .toArray();
        break;

      case 2:
        // Cantidad de aprobados por materia
        result = await col
          .aggregate([
            { $match: { aprobacion: true } },
            { $group: { _id: "$materia", aprobados: { $sum: 1 } } },
          ])
          .toArray();
        break;

      case 3:
        // Aprobados por carrera y año
        result = await col
          .aggregate([
            { $match: { aprobacion: true } },
            {
              $group: {
                _id: { carrera: "$carrera_objetivo", anio: "$anio_de_ingreso" },
                aprobados: { $sum: 1 },
              },
            },
          ])
          .toArray();
        break;

      case 4:
        // Porcentaje de aprobación por materia
        result = await col
          .aggregate([
            {
              $group: {
                _id: "$materia",
                total: { $sum: 1 },
                aprobados: { $sum: { $cond: ["$aprobacion", 1, 0] } },
              },
            },
            {
              $project: {
                porcentaje_aprobacion: {
                  $multiply: [{ $divide: ["$aprobados", "$total"] }, 100],
                },
              },
            },
          ])
          .toArray();
        break;


      default:
        result = { error: "Consulta no encontrada" };
        break;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

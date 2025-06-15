const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function cargarCSV() {
  try {
    await client.connect();
    const db = client.db("Proyecto1");
    const collection = db.collection("aspirantes");

    const filePath = path.join(__dirname, "data", "pruebas_especificas_2023.csv");

    const aspirantes = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // Construimos documento por fila, parseando los datos necesarios
        aspirantes.push({
          fecha_asignacion: data.fecha_asignacion,
          correlativo_aspirante: data.correlativo_aspirante,
          sexo: data.sexo,
          anio_nacimiento: Number(data.anio_nacimiento),
          materia: data.materia,
          numero_de_fecha_de_evaluaci: Number(data.numero_de_fecha_de_evaluaci),
          anio_de_ingreso: Number(data.anio_de_ingreso),
          aprobacion: data.aprobacion.toLowerCase() === "aprobado",
          carrera_objetivo: data.carrera_objetivo,
          departamento_institucion_ed: data.departamento_institucion_ed,
          municipio_institucion_: data.municipio_institucion_,
          tipo_institucion_educativa: data.tipo_institucion_educativa,
        });
      })
      .on("end", async () => {
        if (aspirantes.length > 0) {
          const result = await collection.insertMany(aspirantes);
          console.log(`Se insertaron ${result.insertedCount} documentos.`);
        } else {
          console.log("No se encontraron datos para insertar.");
        }
        await client.close();
      });
  } catch (error) {
    console.error("Error cargando CSV:", error);
  }
}

cargarCSV();

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");

//Conexion a la base de datos
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

/* Carga de datos, seleccionamos base de datos y coleccion a usar */
async function cargarCSV() {
  try {
    await client.connect();
    const db = client.db("Proyecto1");
    const collection = db.collection("aspirantes");

    // Ruta del archivo (Esta en la carpeta data)
    const filePath = path.join(
      __dirname,
      "data",
      "pruebas_especificas_2023.csv"
    );

    // Aquí se almacenarán temporalmente los datos fila por fila
    const aspirantes = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // Construimos documento por fila, parseando los datos necesarios
        // Convertimos anio_nacimiento y anio_de_ingreso a Number.
        //Convertimos aprobacion a un valor booleano (true/false).
        aspirantes.push({
          fecha_asignacion: data.fecha_asignacion || null,
          correlativo_aspirante: data.correlativo_aspirante || null,
          sexo: data.sexo || null,
          anio_nacimiento: data.anio_nacimiento
            ? Number(data.anio_nacimiento)
            : null,
          materia: data.materia || null,
          numero_de_fecha_de_evaluaci: data.numero_de_fecha_de_evaluaci
            ? Number(data.numero_de_fecha_de_evaluaci)
            : null,
          anio_de_ingreso: data.anio_de_ingreso
            ? Number(data.anio_de_ingreso)
            : null,
          aprobacion: data.aprobacion
            ? data.aprobacion.toLowerCase() === "aprobado"
            : null,
          carrera_objetivo: data.carrera_objetivo || null,
          departamento_institucion_ed: data.departamento_institucion_ed || null,
          municipio_institucion_: data.municipio_institucion_ || null,
          tipo_institucion_educativa: data.tipo_institucion_educativa || null,
        });
      })
      //Inserción en MongoDB cuando termina de leer
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

/*
Datos del CSV
correlativo_aspirante - un aspirante
carrera_objetivo - carrera a la que aspira
materia - materia de prueba
fecha_asignacion, numero_de_fecha_de_evaluacion, aprobacion - datos de evaluación
tipo_institucion_educativa, municipio_institucion_, departamento_institucion_ed - datos de institución
sexo, anio_nacimiento, anio_de_ingreso - datos personales
*/

/* 
Como podemos enviar la data a neo4j
Nodos:
(:Aspirante {id, sexo, nacimiento, ingreso})
(:Carrera {nombre})
(:Materia {nombre})
(:Institucion {tipo, municipio, departamento})

Relaciones:
(:Aspirante)-[:ASPIRA_A]->(:Carrera)
(:Aspirante)-[:ESTUDIO_EN]->(:Institucion)
(:Aspirante)-[:REALIZA {fecha_asignacion, fecha_evaluacion, aprobacion}]->(:Materia)
*/

const fs = require("fs");
const csv = require("csv-parser");
const neo4j = require("neo4j-driver");

//Conexion a Neo4j
const driver = neo4j.driver(
  "bolt://localhost:7687",
  //Base de datos neo4j y contraseña 
  neo4j.auth.basic("neo4j", "12345678")
  //neo4j.auth.basic("neo4j", "admin123")
);

//Funcion para recibir una fila del csv y convertirla en nodos y relaciones 
async function procesarFila(session, row) {
  const {
    correlativo_aspirante,
    sexo,
    anio_nacimiento,
    carrera_objetivo,
    materia,
    numero_de_fecha_de_evaluaci,
    fecha_asignacion,
    anio_de_ingreso,
    aprobacion,
    tipo_institucion_educativa,
    municipio_institucion_,
    departamento_institucion_ed,
  } = row;

  try {
    //Empieza la transaccion y utiliza el codigo de neo4j para cargar nodos y relaciones
    //MERGE para evitar duplicados
    await session.writeTransaction((tx) =>
      tx.run(
        `
        MERGE (a:Aspirante {id: $id})
        SET a.sexo = $sexo, a.nacimiento = toInteger($nacimiento), a.ingreso = toInteger($ingreso)

        MERGE (c:Carrera {nombre: $carrera})
        MERGE (m:Materia {nombre: $materia})
        MERGE (i:Institucion {
          tipo: $tipo_institucion,
          municipio: $municipio,
          departamento: $departamento
        })

        MERGE (a)-[:ASPIRA_A]->(c)
        MERGE (a)-[:ESTUDIO_EN]->(i)
        MERGE (a)-[:REALIZA {
          fecha: date($fecha),
          evaluacion: toInteger($evaluacion),
          aprobacion: $aprobacion_bool
        }]->(m)
        `,
        {
          id: correlativo_aspirante,
          sexo,
          nacimiento: anio_nacimiento,
          ingreso: anio_de_ingreso,
          carrera: carrera_objetivo,
          materia,
          evaluacion: numero_de_fecha_de_evaluaci,
          fecha: fecha_asignacion,
          aprobacion_bool:
            aprobacion.toLowerCase() === "true" || aprobacion === "1",
          tipo_institucion: tipo_institucion_educativa,
          municipio: municipio_institucion_,
          departamento: departamento_institucion_ed,
        }
      )
    );
    console.log(`Aspirante ${correlativo_aspirante} procesado`);
  } catch (err) {
    console.error(`Error procesando ${correlativo_aspirante}:`, err);
  }
}

//Cargamos el csv y guardamos linea por linea
//Procesamos linea por linea y enviamos a neo4j
async function cargarCSV() {
  const filas = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream("data/pruebas_especificas_2023.csv")
      .pipe(csv())
      .on("data", (row) => filas.push(row))
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });

  const session = driver.session();

  try {
    for (const fila of filas) {
      await procesarFila(session, fila);
    }
  } finally {
    await session.close();
    await driver.close();
    console.log("Carga completa");
  }
}

cargarCSV();

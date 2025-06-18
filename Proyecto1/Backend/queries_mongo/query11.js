// Consulta 11: Historial de desempeño por aspirante
module.exports = async function (db) {
  const col = db.collection("aspirantes");
  const resultados = await col
    .aggregate([
      {
              $group: {
                _id: {
                  aspirante: "$correlativo_aspirante",
                  materia: "$materia",
                },
                intentos: { $sum: 1 },
                aprobados: {
                  $sum: { $cond: ["$aprobacion", 1, 0] }
                },
                reprobados: {
                  $sum: { $cond: ["$aprobacion", 0, 1] }
                }
              }
            },
            {
              $project: {
                correlativo_aspirante: "$_id.aspirante",
                materia: "$_id.materia",
                intentos: 1,
                aprobados: 1,
                reprobados: 1,
                _id: 0
              }
            },
            {
              $sort: {
                correlativo_aspirante: 1,
                materia: 1
              }
            }
    ])
    .toArray();
    
    return resultados.map(doc => {
        return {
            correlativo_aspirante: doc.correlativo_aspirante,
            materia: doc.materia,
            intentos: doc.intentos,
            aprobados: doc.aprobados,
            reprobados: doc.reprobados
        };
    });
};

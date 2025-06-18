// Consulta 14: Número promedio de intentos por materia
module.exports = async function (db) {
    const col = db.collection("aspirantes");
  return await col
    .aggregate([
        {
            $group: {
                _id: {
                    materia: "$materia",
                    aspirante: "$correlativo_aspirante"
                },
                intentos: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.materia",
                total_intentos: { $sum: "$intentos" },
                total_aspirantes: { $sum: 1 }
            }
        },
        {
            $project: {
                materia: "$_id",
                promedio_intentos: {
                    $round:[
                        { $divide: ["$total_intentos", "$total_aspirantes"] },
                        2
                    ]
                },
                _id: 0
            }
        }
    ])
    .toArray();
};

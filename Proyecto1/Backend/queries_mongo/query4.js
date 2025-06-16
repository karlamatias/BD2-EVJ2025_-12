// Consulta 4: Porcentaje de aprobación por materia
module.exports = async function (col) {
  return await col
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
        }
    ])
    .toArray();
};

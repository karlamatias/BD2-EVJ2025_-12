// Consulta 15: Carreras con más aspirantes reprobados en primer intento
module.exports = async function (col) {
  return await col
    .aggregate([
        {
            $match: {
            numero_de_fecha_de_evaluaci: 1,
            aprobacion: false
            }
        },
        {
            $group: {
            _id: "$carrera_objetivo",
            reprobados_primera: { $sum: 1 }
            }
        },
        { $sort: { reprobados_primera: -1 } },
        { $limit: 5 },
        {
            $project: {
            carrera: "$_id",
            reprobados_primera: 1,
            _id: 0
            }
        }
    ])
    .toArray();
};

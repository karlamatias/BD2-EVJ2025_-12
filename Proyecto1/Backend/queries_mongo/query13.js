// Consulta 13: Tasa de aprobación por edad
module.exports = async function (db) {
    const col = db.collection("aspirantes");
  return await col
    .aggregate([
        {
            $match: {
                "anio_nacimiento": { $exists: true, $type: "number", $ne: null, $ne: NaN }
            }
        },
        {
            $project: {
                edad: { $subtract: [new Date().getFullYear(), "$anio_nacimiento"] },
                aprobacion: 1
            }
        },
        {
            $group: {
                _id: "$edad",
                total: { $sum: 1 },
                aprobados: { $sum: { $cond: ["$aprobacion", 1, 0] } }
            }
        },
        {
            $project: {
                edad: "$_id",
                tasa_aprobacion: {
                    $round : [
                        { $multiply: [{ $divide: ["$aprobados", "$total"] }, 100] },
                        2
                    ]
                },
                _id: 0
            }
        },
        { $sort: { edad: 1 } }
    ])
    .toArray();
};

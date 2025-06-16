// Consulta 9: Top 5 carreras más demandadas entre 16 y 18 años
module.exports = async function (col) {
  return await col
    .aggregate([
        {
            $match: {
                "anio_nacimiento": { $exists: true, $type: "number", $ne: null, $ne: NaN }
            }
        },
        {
            $addFields: {
                edad: { $subtract: [new Date().getFullYear(), "$anio_nacimiento"] }
            }
        },
        {
            $match: {
                edad: { $gte: 16, $lte: 18 }
            }
        },
        {
            $group: {
                _id: "$carrera_objetivo",
                total_aspirantes: { $sum: 1 }
            }
        },
        { $sort: { total_aspirantes: -1 } },
        { $limit: 5 }
    ])
    .toArray();
};

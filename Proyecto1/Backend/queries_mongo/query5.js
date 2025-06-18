// Consulta 5:  Promedio de edad por carrera
module.exports = async function (db) {
    const col = db.collection("aspirantes");
    return await col
        .aggregate([
            {
                $match: {
                    "anio_nacimiento": { $exists: true, $type: "number" },
                    "anio_nacimiento": { $ne: NaN }
                }
            },
            {
                $addFields: {
                    edad: { $subtract: [new Date().getFullYear(), "$anio_nacimiento"] }
                }
            },
            {
                $group: {
                    _id: "$carrera_objetivo",
                    promedio_edad_exacto: { $avg: "$edad" }
                }
            },
            {
                $project: {
                    _id: 1,
                    promedio_edad: { $round: ["$promedio_edad_exacto", 2] }
                }
            },
            { $sort: { _id: 1 }}
        ])
        .toArray();
};

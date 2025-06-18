// Consulta 7: Promedio de edad de aprobados por carrera y tipo de institución
module.exports = async function (db) {
    const col = db.collection("aspirantes");
    return await col
        .aggregate([
            {
                $match: {
                    aprobacion: true,
                    "anio_nacimiento": { $exists: true, $type: "number", $ne: NaN }
                }
            },{
                $addFields: {
                    edad: { $subtract: [new Date().getFullYear(), "$anio_nacimiento"] }
                }
            },
            {
                $group: {
                _id: {
                    carrera: "$carrera_objetivo",
                    tipo_institucion: "$tipo_institucion_educativa"
                },
                promedio_edad_exacto: { $avg: "$edad" }
                }
            },
            {
                $project: {
                    _id: 1,
                    promedio_edad: { $round: ["$promedio_edad_exacto", 2] }
                }
            },
            {
                $sort: {
                "_id.carrera": 1, 
                "_id.tipo_institucion": 1 
                }
            }
        ])
        .toArray();
};

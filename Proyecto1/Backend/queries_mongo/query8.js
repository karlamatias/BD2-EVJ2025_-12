// Consulta 8: Distribución de aprobados por municipio y carrera
module.exports = async function (db) {
    const col = db.collection("aspirantes");
    return await col
        .aggregate([
            {
                $match: { aprobacion: true }
            },
            {
                $group: {
                    _id: {
                        municipio: "$municipio_institucion_",
                        carrera: "$carrera_objetivo"
                    },
                    total_aprobados: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.municipio": 1, 
                    "_id.carrera": 1
                }
            }
        ])
        .toArray();
};

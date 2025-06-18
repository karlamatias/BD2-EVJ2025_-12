// Consulta 9: Evaluaciones por mes y materia (solo instituciones públicas)
module.exports = async function (db) {
    const col = db.collection("aspirantes");
    return await col
        .aggregate([
            {
                $match: {
                    tipo_institucion_educativa: "PUBLICO",
                    fecha_asignacion: { $exists: true, $type: "string", $ne: null, $ne: "", $ne: NaN }
                }
            },
            {
                $addFields: {
                    mes: {$month: { $toDate: "$fecha_asignacion" } }
                }
            },
            {
                $group: {
                    _id: { mes: "$mes", materia: "$materia" },
                    cantidad: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.mes": 1,  
                    "_id.materia": 1  
                }
            }
        ])
        .toArray();
};

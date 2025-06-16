// Consulta 11: Distribución por sexo y tipo de institución
module.exports = async function (col) {
    const resultados = await col
    .aggregate([
        {
            $group: {
                _id: {
                    sexo: "$sexo",
                    tipo: "$tipo_institucion_educativa"
                },
                cantidad: { $sum: 1 }
            }
        },
        {
            $project: {
                sexo: "$_id.sexo",
                tipo_institucion: "$_id.tipo",
                cantidad: 1,
                _id: 0
            }
        },
        {
            $sort: {
                sexo: 1,
                tipo_institucion: 1
            }
        }
    ])
    .toArray();
    return resultados.map(doc => {
        return {
            sexo: doc.sexo,
            tipo_institucion: doc.tipo_institucion,
            cantidad: doc.cantidad
        };
    });
};

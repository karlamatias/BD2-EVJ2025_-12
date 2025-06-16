// Consulta 1: Aspirantes por tipo de institución educativa
module.exports = async function (col) {
  return await col
    .aggregate([
        {
            $group: {
            _id: "$tipo_institucion_educativa",
            total_aspirantes: { $sum: 1 },
            },
        },
    ])
    .toArray();
};

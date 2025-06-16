// Consulta 3: Aprobados por carrera y año
module.exports = async function (col) {
  return await col
    .aggregate([
        { $match: { aprobacion: true } },
        {
            $group: {
                _id: { carrera: "$carrera_objetivo", anio: "$anio_de_ingreso" },
                aprobados: { $sum: 1 },
            },
        }
    ])
    .toArray();
};

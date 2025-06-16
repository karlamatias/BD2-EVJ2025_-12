// Consulta 2: Cantidad de aprobados por materia
module.exports = async function (col) {
  return await col
        .aggregate([
            { $match: { aprobacion: true } },
            { $group: { _id: "$materia", aprobados: { $sum: 1 } } },
        ])
        .toArray();
};

// Consulta 2: Cantidad de aprobados por materia
module.exports = async function (db) {
  const col = db.collection("aspirantes");
  return await col
        .aggregate([
            { $match: { aprobacion: true } },
            { $group: { _id: "$materia", aprobados: { $sum: 1 } } },
        ])
        .toArray();
};

// Consulta 6:  Creación de colección auxiliar (resumen_carrera)
module.exports = async function (db) {
    const col = db.collection("aspirantes");
    await col
        .aggregate([
            {
                $group: {
                    _id: "$carrera_objetivo",
                    total: { $sum: 1 },
                    aprobados: {
                        $sum: { $cond: ["$aprobacion", 1, 0] },
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    carrera: "$_id",
                    total: 1,
                    aprobados: 1
                }
            },
            {
                $out: "resumen_carrera"
            }
      ])
    return await db.collection("resumen_carrera").find().toArray();
  };
  
// Consulta 14: Historial completo de un aspirante (por correlativo)
module.exports = async function (col, correlativo) {
    if (!correlativo) {
        const primerAspirante = await col.findOne({});
        if (primerAspirante) {
            correlativo = primerAspirante.correlativo_aspirante;
        } else {
            throw new Error("No se encontraron aspirantes en la colección.");
        }
        
    }
    return await col
        .find({ correlativo_aspirante: correlativo })
        .sort({ fecha_asignacion: 1 })
        .toArray();
};

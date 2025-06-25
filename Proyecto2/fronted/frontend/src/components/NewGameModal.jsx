import Swal from "sweetalert2";
import { createGame } from "../services/api"; 

export async function openNewGameModal(onRefresh) {
  const result = await Swal.fire({
    title: "Nuevo Juego",
    html:
      `<input id="swal-titulo" class="swal2-input" placeholder="Titulo">` +
      `<input id="swal-descripcion" class="swal2-input" placeholder="Descipcion">` +
      `<input id="swal-genero" class="swal2-input" placeholder="Genero">` +
      `<input id="swal-desarrollador" class="swal2-input" placeholder="Desarrollador">`+
      `<input id="swal-plataformas" class="swal2-input" placeholder="Plataformas">`+
      `<input id="swal-fecha_lanzamiento" class="swal2-input" placeholder="Fecha Lanzamiento">`+
      `<input id="swal-clasificacion_edad" class="swal2-input" placeholder="Clasificacion Edad">`+
      `<input id="swal-imagen_url" class="swal2-input" placeholder="Url de Imagen">`,
    showCancelButton: true,
    confirmButtonText: "Crear",
    reverseButtons: true,
    preConfirm: () => {
      const titulo = document.getElementById("swal-titulo").value;
      const descripcion = document.getElementById("swal-descripcion").value;
      const genero = document.getElementById("swal-genero").value;
      const desarrollador = document.getElementById("swal-desarrollador").value;
      const plataformas = document.getElementById("swal-plataformas").value;
      const fecha_lanzamiento = document.getElementById("swal-fecha_lanzamiento").value;
      const clasificacion_edad = document.getElementById("swal-clasificacion_edad").value;
      const imagen_url = document.getElementById("swal-imagen_url").value;
      if (!titulo || !descripcion || !genero || !desarrollador || !plataformas || !fecha_lanzamiento || !clasificacion_edad || !imagen_url) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }
      return { titulo, descripcion, genero, desarrollador, plataformas, fecha_lanzamiento, clasificacion_edad, imagen_url };
    },
  });

  if (result.isConfirmed && result.value) {
    try {
      await createGame(result.value);
      await Swal.fire("¡Éxito!", "Juego creado correctamente", "success");
      onRefresh();
    } catch {
      await Swal.fire("Error", "No se pudo crear el juego", "error");
    }
  }
}

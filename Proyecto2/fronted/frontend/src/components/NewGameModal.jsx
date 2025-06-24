import Swal from "sweetalert2";
import { createGame } from "../services/api"; 

export async function openNewGameModal(onRefresh) {
  const result = await Swal.fire({
    title: "Nuevo Juego",
    html:
      `<input id="swal-titulo" class="swal2-input" placeholder="Titulo">` +
      `<input id="swal-descripcion" class="swal2-input" placeholder="Descipcion">` +
      `<input id="swal-genero" class="swal2-input" placeholder="Genero">` +
      `<input id="swal-desarrollador" class="swal2-input" placeholder="Desarrollador">`,
    showCancelButton: true,
    confirmButtonText: "Crear",
    reverseButtons: true,
    preConfirm: () => {
      const titulo = document.getElementById("swal-titulo").value;
      const descripcion = document.getElementById("swal-descripcion").value;
      const genero = document.getElementById("swal-genero").value;
      const desarrollador = document.getElementById("swal-desarrollador").value;
      if (!titulo || !descripcion || !genero || !desarrollador) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }
      return { titulo, descripcion, genero, desarrollador };
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

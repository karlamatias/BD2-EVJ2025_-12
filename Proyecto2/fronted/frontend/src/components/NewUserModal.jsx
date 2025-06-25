import Swal from "sweetalert2";
import { createUser } from "../services/api";

export async function openNewUserModal(onRefresh) {
  const result = await Swal.fire({
    title: "Nuevo Usuario",
    html:
      ` <div style="display: flex; flex-direction: column; align-items: center;">
      <input id="swal-username" class="swal2-input" placeholder="Usuario">` +
      `<input id="swal-email" class="swal2-input" placeholder="Email">` +
      `<input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña">` +
      `<select id="swal-role" class="swal2-input" 
      style="
    border: none;
    border-bottom: 1px solid #d9d9d9;
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
    height: 2.5em;
  ">
        <option value="">Rol</option>
        <option value="admin">Admin</option>
        <option value="user">Usuario</option>
      </select>
      </div>`,
    showCancelButton: true,
    confirmButtonText: "Crear",
    reverseButtons: true,
    preConfirm: () => {
      const username = document.getElementById("swal-username").value;
      const email = document.getElementById("swal-email").value;
      const password_hash = document.getElementById("swal-password").value;
      const role = document.getElementById("swal-role").value;
      if (!username || !email || !password_hash || !role) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }
      return { username, email, password_hash, role };
    },
  });

  if (result.isConfirmed && result.value) {
    try {
      await createUser(result.value);
      await Swal.fire("¡Éxito!", "Usuario creado correctamente", "success");
      onRefresh();
    } catch {
      await Swal.fire("Error", "No se pudo crear el usuario", "error");
    }
  }
}

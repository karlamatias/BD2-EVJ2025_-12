import React from "react";
import { openNewUserModal } from "./NewUserModal";

export default function UserTable({ users = [], onDelete, onRefresh }) {
  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Usuarios Registrados</h2>
        <button
          onClick={() => openNewUserModal(onRefresh)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Nuevo Usuario
        </button>
      </div>

      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Usuario</th>
            <th className="px-4 py-2">Correo</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="px-4 py-2">{u.username}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2 capitalize">{u.role}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onDelete(u.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

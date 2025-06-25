import React from "react";
import { openNewGameModal } from "./NewGameModal";
import { FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

export default function GameTable({ games, onDelete, onRefresh }) {
  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Juegos en Plataforma</h2>
        <button
          onClick={() => openNewGameModal(onRefresh)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <FaPlus size={20} />
        </button>
      </div>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Imagen</th>
            <th className="px-4 py-2">Titulo</th>
            <th className="px-4 py-2">Descripcion</th>
            <th className="px-4 py-2">Genero</th>
            <th className="px-4 py-2">Desarrollador</th>
            <th className="px-4 py-2">Plataformas</th>
            <th className="px-4 py-2">Fecha de Lanzamiento</th>
            <th className="px-4 py-2">Clasificacion Edad</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g.id} className="border-t">
              <td className="px-4 py-2">
                {g.imagen_url ? (
                  <img
                    src={g.imagen_url}
                    alt={g.titulo}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400 italic">Sin imagen</span>
                )}
              </td>
              <td className="px-4 py-2">{g.titulo}</td>
              <td className="px-4 py-2">{g.descripcion}</td>
              <td className="px-4 py-2 capitalize">{g.genero}</td>
              <td className="px-4 py-2 capitalize">{g.desarrollador}</td>
              <td className="px-4 py-2 capitalize">{g.plataformas}</td>
              <td className="px-4 py-2 capitalize">{g.fecha_lanzamiento}</td>
              <td className="px-4 py-2 capitalize">{g.clasificacion_edad}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onDelete(g.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  title="Eliminar"
                >
                  <FiTrash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

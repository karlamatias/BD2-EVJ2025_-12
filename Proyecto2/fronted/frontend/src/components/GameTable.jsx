import React from "react";
import { openNewGameModal } from "./NewGameModal";

export default function GameTable({ games, onDelete, onRefresh }) {
  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Juegos en Plataforma</h2>
        <button
          onClick={() => openNewGameModal(onRefresh)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Nuevo Juego
        </button>
      </div>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Titulo</th>
            <th className="px-4 py-2">Descripcion</th>
            <th className="px-4 py-2">Genero</th>
            <th className="px-4 py-2">Desarrollador</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g.id} className="border-t">
              <td className="px-4 py-2">{g.titulo}</td>
              <td className="px-4 py-2">{g.descripcion}</td>
              <td className="px-4 py-2 capitalize">{g.genero}</td>
              <td className="px-4 py-2 capitalize">{g.desarrollador}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onDelete(g.id)}
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

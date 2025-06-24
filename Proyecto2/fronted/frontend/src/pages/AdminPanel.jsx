// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  getGames,
  createGame,
  deleteGames,
} from "../services/api";
import UserTable from "../components/UserTable";
import GameTable from "../components/GameTable";
import NewGameForm from "../components/NewGameModal";
import Swal from "sweetalert2";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState("usuarios");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [userData, gameData] = await Promise.all([getUsers(), getGames()]);
    setUsers(userData);
    setGames(gameData);
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",

      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
      }
    }
  };

  const handleDeleteGames = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",

      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteGames(id);
        Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Panel de Administrador
      </h1>

      {/* Menú de Navegación */}
      <div className="flex justify-center mb-8 space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "usuarios"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
          onClick={() => setActiveTab("usuarios")}
        >
          Usuarios
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "juegos"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
          onClick={() => setActiveTab("juegos")}
        >
          Juegos
        </button>
      </div>

      {/* Contenido según pestaña */}
      {activeTab === "usuarios" && (
        <UserTable
          users={users}
          onDelete={handleDeleteUser}
          onRefresh={fetchData}
        />
      )}
      {activeTab === "juegos" && (
        <GameTable
          games={games}
          onDelete={handleDeleteGames}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
}

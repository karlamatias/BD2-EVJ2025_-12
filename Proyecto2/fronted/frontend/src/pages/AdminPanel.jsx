import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, getGames, deleteGames } from "../services/api";
import UserTable from "../components/UserTable";
import GameTable from "../components/GameTable";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState("usuarios");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

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
        Swal.fire("Eliminado", "El juego ha sido eliminado.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el juego.", "error");
      }
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#ebf5fb" }}>
      {/* Menú lateral azul oscuro */}
      <aside
        className="w-64 h-screen text-white p-6 flex flex-col justify-between"
        style={{ backgroundColor: "#154360" }}
      >
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">Admin</h2>
          <nav className="flex flex-col space-y-4">
            <button
              className={`text-left px-4 py-2 rounded transition`}
              style={{
                backgroundColor:
                  activeTab === "usuarios" ? "#21618c" : "transparent",
                color: "#ffffff",
              }}
              onClick={() => setActiveTab("usuarios")}
            >
              Usuarios
            </button>
            <button
              className={`text-left px-4 py-2 rounded transition`}
              style={{
                backgroundColor:
                  activeTab === "juegos" ? "#21618c" : "transparent",
                color: "#ffffff",
              }}
              onClick={() => setActiveTab("juegos")}
            >
              Juegos
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="mt-8 py-2 px-4 rounded transition text-white"
          style={{
            backgroundColor: "#2874a6",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#2e86c1 ")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#2874a6")
          }
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-[#1f618d] text-center">
          Panel de Administrador
        </h1>
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
      </main>
    </div>
  );
}

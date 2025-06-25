import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHome from "../components/UserHome";
import UserReviews from "../components/UserReviews";
import { useAuth } from "../context/AuthContext";

export default function UserPanel() {
  const [selected, setSelected] = useState("home");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const renderContent = () => {
    switch (selected) {
      case "home":
        return <UserHome />;
      case "reviews":
        return <UserReviews />;
      default:
        return <UserHome />;
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Menú lateral */}
      <aside className="w-64 bg-blue-950 text-white flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold p-4 border-b border-blue-700">
            Menú
          </h2>
          <nav className="flex flex-col p-4 space-y-2">
            <button
              onClick={() => setSelected("home")}
              className={`text-left px-4 py-2 rounded hover:bg-blue-700 ${
                selected === "home" ? "bg-blue-700" : ""
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setSelected("reviews")}
              className={`text-left px-4 py-2 rounded hover:bg-blue-700 ${
                selected === "reviews" ? "bg-blue-700" : ""
              }`}
            >
              Mis Reseñas
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full bg-gray-700 hover:bg-gray-900 text-white py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Vista principal */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
}

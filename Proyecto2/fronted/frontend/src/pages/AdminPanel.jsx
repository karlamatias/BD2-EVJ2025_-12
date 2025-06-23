// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, getGames, createGame } from "../services/api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({ title: "", genre: "", developer: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setUsers(await getUsers());
    setGames(await getGames());
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    fetchData();
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    await createGame(newGame);
    setNewGame({ title: "", genre: "", developer: "" });
    fetchData();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Panel de Administrador</h2>

      <section>
        <h3>Agregar Nuevo Videojuego</h3>
        <form onSubmit={handleAddGame}>
          <input
            type="text"
            placeholder="Título"
            value={newGame.title}
            onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Género"
            value={newGame.genre}
            onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
          />
          <input
            type="text"
            placeholder="Desarrollador"
            value={newGame.developer}
            onChange={(e) => setNewGame({ ...newGame, developer: e.target.value })}
          />
          <button type="submit">Agregar</button>
        </form>
      </section>

      <section>
        <h3>Usuarios Registrados</h3>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.username} ({u.email}) - rol: {u.role}
              <button onClick={() => handleDeleteUser(u.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Juegos en Plataforma</h3>
        <ul>
          {games.map((g) => (
            <li key={g.id}>{g.title} - {g.genre} - {g.developer}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import AddReviewModal from "../components/AddReviewModal";
import GameReviewsModal from "../components/GameReviewsModal";
import { useAuth } from "../context/AuthContext";
import { getGames, createReview } from "../services/api";
import Swal from "sweetalert2";

export default function UserHome() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [viewGame, setViewGame] = useState(null); 
  const { user } = useAuth();

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await getGames();
        setGames(data);
      } catch (error) {
        console.error("Error al cargar los juegos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleSubmitReview = async ({ game_id, user_id, score, comment }) => {
    try {
      await createReview({ game_id, user_id, score, comment }); // sin overwrite
      setSelectedGame(null);
      await Swal.fire("¡Listo!", "Reseña agregada exitosamente", "success");
      setViewGame({ id: game_id, title: selectedGame.title });
    } catch (error) {
      if (error.response && error.response.status === 409) {
          const result = await Swal.fire({ // Ya existe una reseña, pedir confirmacion
          title: "¿Sobrescribir reseña?",
          text: "Ya habías publicado una reseña sobre este juego. Si continúas, se eliminará la anterior.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sobrescribir",
          cancelButtonText: "Cancelar",
        });
  
        if (result.isConfirmed) {
          try {
            await createReview({ game_id, user_id, score, comment, overwrite: true });
            setSelectedGame(null);
            await Swal.fire("Actualizada", "Tu reseña fue reemplazada", "success");
            setViewGame({ id: game_id, title: selectedGame.title });
          } catch (e) {
            await Swal.fire("Error", "Ocurrió un error al sobrescribir la reseña", "error");
          }
        }
      } else {
        console.error("Error al enviar reseña:", error);
        await Swal.fire("Error", "Ocurrió un error al registrar la reseña", "error");
      }
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-8">
        Videojuegos recomendados
      </h1>

      {loading ? (
        <p className="text-gray-600 text-lg">Cargando juegos...</p>
      ) : games.length === 0 ? (
        <p className="text-gray-600 text-lg">No hay juegos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white shadow-xl rounded-2xl p-6 flex flex-col justify-between transition duration-300 border border-blue-100 hover:border-blue-300"
            >
              <div>
                <h2 className="text-2xl font-bold text-blue-700 mb-2 font-sans">
                  {game.titulo}
                </h2>

                {game.average_score !== null ? (
                    <p className="text-yellow-600 font-semibold mt-2">
                        ⭐ {game.average_score} / 10
                    </p>
                ) : (
                    <p className="text-gray-400 italic mt-2">Aún sin puntuaciones</p>
                )}

                <hr className="border-blue-200 my-3" />

                <div className="space-y-1 text-sm text-gray-700 font-medium leading-relaxed">
                  <p>
                    <span className="text-blue-900 font-semibold">Género:</span>{" "}
                    {game.genero}
                  </p>
                  <p>
                    <span className="text-blue-900 font-semibold">Desarrollador:</span>{" "}
                    {game.desarrollador}
                  </p>
                </div>

                {game.descripcion && (
                  <>
                    <hr className="border-blue-200 my-4" />
                    <p className="text-gray-600 text-sm italic leading-relaxed font-light">
                      {game.descripcion}
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                    className="bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded-xl text-sm font-semibold shadow"
                    onClick={() => setViewGame(game)}
                >
                    Ver reseñas
                </button>
                <button
                    className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-xl text-sm font-semibold shadow"
                    onClick={() => setSelectedGame(game)}
                >
                    Agregar reseña
                </button>
              </div>
            </div>
          ))}
        </div>

        )}
        
        { selectedGame && (
            <AddReviewModal
                game={selectedGame}
                userId={user?.id}
                onClose={() => setSelectedGame(null)}
                onSubmit={handleSubmitReview}
            />
        )}

        {viewGame && (
            <GameReviewsModal 
                game={viewGame} 
                onClose={() => setViewGame(null)} 
                onAddReview={(game) => setSelectedGame(game)}
            />
        )}
        
    </div>
  );
}

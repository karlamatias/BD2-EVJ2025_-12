import React, { useEffect, useState } from "react";
import { getReviewsByGame } from "../services/api";

export default function GameReviewsModal({ game, onClose, onAddReview, reviewsChanged  }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await getReviewsByGame(game.id);
        setReviews(data);
      } catch (error) {
        console.error("Error al cargar reseñas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [game.id, reviewsChanged]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Reseñas de: {game.titulo}
        </h2>

        {loading ? (
          <p className="text-gray-600">Cargando reseñas...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 italic">Aún no hay reseñas.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="border-b pb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>
                    <strong>@{review.username}</strong> 
                  </span>
                  <span>
                    <strong>Puntuación:</strong> {review.score}
                  </span>
                </div>
                <p className="text-gray-700 italic m-2">{review.comment}</p>
                <p className="text-sm text-gray-500">
                    Publicado el: {new Date(Number(review.timestamp)).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end gap-2">
        <button
            onClick={() => {
                onClose();
                onAddReview(game);
            }}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
        >
            Agrega reseña propia
        </button>
        <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
            Cerrar
        </button>
        </div>

      </div>
    </div>
  );
}

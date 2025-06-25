import React, { useEffect, useState } from "react";
import { getReviewsByUser, deleteReview } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function UserReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  const loadReviews = async () => {
    try {
      const data = await getReviewsByUser(user.id);
      setReviews(data);
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
    }
  };

  useEffect(() => {
    if (user) loadReviews();
  }, [user]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar reseña?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#718096",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteReview(id);
        await Swal.fire("Eliminada", "La reseña fue eliminada", "success");
        loadReviews();
      } catch (error) {
        console.error("Error al eliminar reseña:", error);
        Swal.fire("Error", "No se pudo eliminar la reseña", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Mis Reseñas</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">Aún no has publicado reseñas.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-blue-700">
                  {review.game_title}
                </h3>
                <span className="text-yellow-600 font-bold">
                  ⭐ {review.score} / 10
                </span>
              </div>
              <p className="text-gray-700 italic mb-2">"{review.comment}"</p>
              <p className="text-sm text-gray-500 mb-3">
                Publicado el{" "}
                {new Date(Number(review.timestamp)).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <button
                onClick={() => handleDelete(review.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

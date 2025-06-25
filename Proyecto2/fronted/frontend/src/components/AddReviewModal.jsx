import React, { useState } from "react";

export default function AddReviewModal({ game, userId, onClose, onSubmit }) {
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!score || score < 1 || score > 10) {
      setError("La puntuación debe estar entre 1 y 10.");
      return;
    }
    if (!comment.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    onSubmit({ game_id: game.id, user_id: userId, score, comment });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold text-blue-800 mb-4">
          Agregar reseña a: {game.title}
        </h2>

        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">
            Puntuación (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            className="w-full border rounded px-3 py-2"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">
            Comentario
          </label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-sky-700 hover:bg-sky-800 text-white"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}

import axios from "axios";

const API_URL = "http://localhost:3000";

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
}


export async function getUsers() {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
}

export async function deleteUser(id) {
  return await axios.delete(`${API_URL}/users/${id}`);
}

export async function getGames() {
  const res = await axios.get(`${API_URL}/games`);
  return res.data;
}

export async function createGame(data) {
  const res = await axios.post(`${API_URL}/games`, data);
  return res.data;
}

export async function createUser(data) {
  const res = await axios.post(`${API_URL}/users`, data);
  return res.data;
}

export async function deleteGames(id) {
  return await axios.delete(`${API_URL}/games/${id}`);
}

export async function createReview({ game_id, user_id, score, comment, overwrite = false }) {
  const res = await axios.post(`${API_URL}/reviews`, {
    game_id, user_id, score, comment, overwrite,
  });
  return res.data;
}

export async function getReviewsByGame(id){
  const res = await axios.get(`${API_URL}/games/${id}/reviews`);
  return res.data;
}

export async function getReviewsByUser(user_id) {
  const res = await axios.get(`${API_URL}/users/${user_id}/reviews`);
  return res.data;
}

export async function deleteReview(id) {
  const res = await axios.delete(`${API_URL}/reviews/${id}`);
  return res.data;
}

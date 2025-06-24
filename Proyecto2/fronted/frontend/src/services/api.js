import axios from "axios";

const API_URL = "http://localhost:3000";

export async function login(email, password_hash) {
  const res = await axios.post(`${API_URL}/login`, { email, password_hash });
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

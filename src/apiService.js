import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return {};
  }
  return {    
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const loginAPI = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  return response.data;
};

export const registerAPI = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const getVideojuegosAPI = async (page = 1, limit = 12, orden = "fecha") => {
  const response = await axios.get(
    `${API_URL}/videojuegos?page=${page}&limit=${limit}&orden=${orden}`,
    getAuthHeaders()
  );
  return response.data;
};

export const getMisVideojuegosAPI = async (page = 1, limit = 12) => {
  const response = await axios.get(`${API_URL}/videojuegos/mios?page=${page}&limit=${limit}`, getAuthHeaders());
  return response.data;
};

export const getVideojuegoByIdAPI = async (id) => {
  const response = await axios.get(`${API_URL}/videojuegos/${id}`, getAuthHeaders());
  return response.data;
};

export const addVideojuegoAPI = async (payload) => {
  const response = await axios.post(`${API_URL}/videojuegos`, payload, getAuthHeaders());
  return response.data;
};

export const deleteVideojuegoAPI = async (id) => {
  const response = await axios.delete(`${API_URL}/videojuegos/${id}`, getAuthHeaders());
  return response.data;
};

export const votarVideojuegoAPI = async (id, tipo) => {
  const response = await axios.post(`${API_URL}/videojuegos/${id}/votar`, { tipo }, getAuthHeaders());
  return response.data;
};

export const addComentarioAPI = async (videojuegoId, texto) => {
  const response = await axios.post(
    `${API_URL}/videojuegos/${videojuegoId}/comentarios`,
    { texto },
    getAuthHeaders()
  );
  return response.data;
};

export const deleteComentarioAPI = async (videojuegoId, comentarioId) => {
  const response = await axios.delete(
    `${API_URL}/videojuegos/${videojuegoId}/comentarios/${comentarioId}`,
    getAuthHeaders()
  );
  return response.data;
};

export const reportarVideojuegoAPI = async (videojuegoId, motivo = "") => {
  const response = await axios.post(
    `${API_URL}/videojuegos/${videojuegoId}/reportar`,
    { motivo },
    getAuthHeaders()
  );
  return response.data;
};

export const getReportadosAPI = async () => {
  const response = await axios.get(`${API_URL}/admin/reportados`, getAuthHeaders());
  return response.data;
};

export const deleteReportadoAPI = async (videojuegoId) => {
  const response = await axios.delete(`${API_URL}/admin/reportados/${videojuegoId}`, getAuthHeaders());
  return response.data;
};

export const askAssistantAPI = async (message) => {
  const response = await axios.post(`${API_URL}/assistant/chat`, { message }, getAuthHeaders());
  return response.data;
};

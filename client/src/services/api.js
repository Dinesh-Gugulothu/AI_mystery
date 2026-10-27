import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api/v1', timeout: 90000 });
export const createCase = async (payload) => (await api.post('/cases', payload)).data;
export const getCase = async (id) => (await api.get(`/cases/${id}`)).data;
export const getHistory = async () => (await api.get('/cases')).data;
export const accuse = async (id, payload) => (await api.post(`/cases/${id}/accusation`, payload)).data;
export const deleteCase = async (id) => (await api.delete(`/cases/${id}`)).data;
export default api;

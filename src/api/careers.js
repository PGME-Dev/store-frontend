import axios from 'axios';
import client from './client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function submitCareerApplication(data) {
  return client.post('/career-applications', data).then((r) => r.data);
}

export function submitCareerApplicationGuest(data) {
  return axios.post(`${API_BASE_URL}/career-applications/guest`, data).then((r) => r.data);
}

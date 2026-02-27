import client from './client';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getSubjects() {
  // Public endpoint — no auth needed
  const { data } = await axios.get(`${API_BASE_URL}/subjects`);
  return data.data;
}

export async function getUserSubjectSelection() {
  // Authenticated endpoint — uses client with JWT
  const { data } = await client.get('/users/subject-selections', {
    params: { is_primary: true },
  });
  return data.data;
}

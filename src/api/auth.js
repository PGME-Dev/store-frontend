import client from './client';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function verifyWebToken(token) {
  // Use raw axios (no auth interceptor needed for public endpoint)
  const { data } = await axios.post(`${API_BASE_URL}/auth/verify-web-token`, { token });
  return data.data;
}

export async function verifyWidget(accessToken) {
  // No device_id / device_name / fcm_token — keeps web-store out of device session tracking
  // register_if_new: false — prevent creating ghost user records from the web store
  const { data } = await axios.post(`${API_BASE_URL}/auth/verify-widget`, {
    access_token: accessToken,
    register_if_new: false,
  });
  return data.data;
}

export async function refreshToken(refresh_token) {
  const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refresh_token });
  return data.data;
}

export async function getUserProfile() {
  const { data } = await client.get('/users/profile');
  return data.data;
}

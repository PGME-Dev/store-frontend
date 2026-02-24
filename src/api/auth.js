import client from './client';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function verifyWebToken(token) {
  // Use raw axios (no auth interceptor needed for public endpoint)
  const { data } = await axios.post(`${API_BASE_URL}/auth/verify-web-token`, { token });
  return data.data;
}

export async function sendOTP(phone_number) {
  const { data } = await axios.post(`${API_BASE_URL}/auth/send-otp`, { phone_number });
  return data.data;
}

export async function verifyOTP(phone_number, otp_code) {
  const { data } = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
    phone_number,
    otp_code,
    device_type: 'Web',
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

import client from './client';

export function sendInquiry({ name, email, phone, subject, message }) {
  return client.post('/contact/inquiry', { name, email, phone, subject, message }).then((r) => r.data);
}

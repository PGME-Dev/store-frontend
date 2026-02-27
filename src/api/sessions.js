import client from './client';

export async function getSessions(subjectId) {
  const params = {};
  if (subjectId) params.subject_id = subjectId;
  const { data } = await client.get('/live-sessions', { params });
  return data.data;
}

export async function getSessionById(sessionId) {
  const { data } = await client.get(`/live-sessions/${sessionId}`);
  return data.data;
}

export async function createSessionPaymentSession(sessionId, billingAddress) {
  const { data } = await client.post(`/live-sessions/${sessionId}/create-order`, {
    billing_address: billingAddress,
  });
  return data.data;
}

export async function verifySessionPayment(sessionId, paymentSessionId, paymentId, signature) {
  const { data } = await client.post(`/live-sessions/${sessionId}/verify-payment`, {
    payment_session_id: paymentSessionId,
    payment_id: paymentId,
    signature,
  });
  return data.data;
}

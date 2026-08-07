import client from './client';

export async function getSessions(subjectId) {
  const params = { limit: 50, upcoming_only: 'true' };
  if (subjectId) params.subject_id = subjectId;
  const { data } = await client.get('/live-sessions', { params });
  return data.data;
}

export async function getSessionById(sessionId) {
  const { data } = await client.get(`/live-sessions/${sessionId}`);
  return data.data;
}

export async function createSessionPaymentSession(sessionId, billingAddress, couponCode) {
  const { data } = await client.post(`/live-sessions/${sessionId}/create-order`, {
    billing_address: billingAddress,
    coupon_code: couponCode || undefined,
  });
  return data.data;
}

export async function verifySessionPayment(sessionId, paymentSessionId, paymentId, signature, termsAccepted) {
  const { data } = await client.post(`/live-sessions/${sessionId}/verify-payment`, {
    payment_session_id: paymentSessionId,
    payment_id: paymentId,
    signature,
    terms_accepted: termsAccepted,
  });
  return data.data;
}

export async function getSessionEnrollmentStatus(sessionId) {
  const { data } = await client.get(`/live-sessions/${sessionId}/enrollment-status`);
  return data.data;
}

export async function enrollInSession(sessionId) {
  const { data } = await client.post(`/live-sessions/${sessionId}/enroll`);
  return data.data;
}

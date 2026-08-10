import client from './client';

export async function getWorkshops(subjectId) {
  const params = { limit: 50, upcoming_only: 'true' };
  if (subjectId) params.subject_id = subjectId;
  const { data } = await client.get('/workshops', { params });
  return data.data;
}

export async function getWorkshopById(workshopId) {
  const { data } = await client.get(`/workshops/${workshopId}`);
  return data.data;
}

export async function getWorkshopCapacity(workshopId) {
  const { data } = await client.get(`/workshops/${workshopId}/capacity`);
  return data.data;
}

export async function getWorkshopRecordings(workshopId) {
  const { data } = await client.get(`/workshops/${workshopId}/recordings`);
  return data.data;
}

export async function createWorkshopPaymentSession(workshopId, billingAddress, couponCode) {
  const { data } = await client.post(`/workshops/${workshopId}/create-order`, {
    billing_address: billingAddress,
    coupon_code: couponCode || undefined,
  });
  return data.data;
}

export async function verifyWorkshopPayment(workshopId, paymentSessionId, paymentId, signature, termsAccepted) {
  const { data } = await client.post(`/workshops/${workshopId}/verify-payment`, {
    payment_session_id: paymentSessionId,
    payment_id: paymentId,
    signature,
    terms_accepted: termsAccepted,
  });
  return data.data;
}

export async function getWorkshopEnrollmentStatus(workshopId) {
  const { data } = await client.get(`/workshops/${workshopId}/enrollment-status`);
  return data.data;
}

export async function enrollInWorkshop(workshopId) {
  const { data } = await client.post(`/workshops/${workshopId}/enroll`);
  return data.data;
}

export async function cancelWorkshopEnrollment(workshopId) {
  const { data } = await client.delete(`/workshops/${workshopId}/enroll`);
  return data.data;
}

/**
 * Join one day of a workshop.
 *
 * Days are LiveSessions under the hood, so this reuses the live-session join
 * endpoint — it detects the workshop and resolves entitlement there. Returns
 * `{ meeting_link }`, which the caller opens in a new tab.
 */
export async function joinWorkshopDay(sessionId) {
  const { data } = await client.post(`/live-sessions/${sessionId}/join`);
  return data.data;
}

export async function getCertificateStatus(workshopId) {
  const { data } = await client.get(`/workshops/${workshopId}/certificate`);
  return data.data;
}

export async function claimCertificate(workshopId) {
  const { data } = await client.post(`/workshops/${workshopId}/certificate`);
  return data.data;
}

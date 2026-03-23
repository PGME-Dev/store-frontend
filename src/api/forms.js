import client from './client';

export async function getFormsBySubject(subjectId) {
  const { data } = await client.get('/forms', { params: { subject_id: subjectId } });
  return data.data?.forms || [];
}

export async function submitForm(formId, responses) {
  const { data } = await client.post(`/forms/${formId}/submit`, { responses });
  return data.data;
}

export async function getAllForms(search) {
  const params = {};
  if (search) params.search = search;
  const { data } = await client.get('/forms/all', { params });
  return data.data?.forms || [];
}

export async function getMySubmissions() {
  const { data } = await client.get('/forms/my-submissions');
  return data.data?.submissions || [];
}

export async function getFormById(formId) {
  const { data } = await client.get(`/forms/${formId}`);
  return data.data?.form || null;
}

export async function createFormPaymentSession(formId, submissionId, billingAddress) {
  const { data } = await client.post('/form-payments/create-order', {
    form_id: formId,
    submission_id: submissionId,
    billing_address: billingAddress,
  });
  return data.data;
}

export async function verifyFormPayment(paymentSessionId, paymentId, signature) {
  const { data } = await client.post('/form-payments/verify', {
    payment_session_id: paymentSessionId,
    payment_id: paymentId,
    signature,
  });
  return data.data;
}

export async function getFormPaymentStatus(submissionId) {
  const { data } = await client.get(`/form-payments/status/${submissionId}`);
  return data.data;
}

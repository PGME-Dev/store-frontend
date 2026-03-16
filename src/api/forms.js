import client from './client';

export async function getFormsBySubject(subjectId) {
  const { data } = await client.get('/forms', { params: { subject_id: subjectId } });
  return data.data?.forms || [];
}

export async function submitForm(formId, responses) {
  const { data } = await client.post(`/forms/${formId}/submit`, { responses });
  return data.data;
}

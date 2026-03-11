import client from './client';

export function submitCareerApplication(data) {
  return client.post('/career-applications', data).then((r) => r.data);
}

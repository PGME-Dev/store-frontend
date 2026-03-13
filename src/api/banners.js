import client from './client';

export async function getBanners() {
  const { data } = await client.get('/banners', { params: { is_active: true } });
  return data.data?.banners || data.data || [];
}

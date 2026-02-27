import client from './client';

export async function getAllPurchases() {
  const { data } = await client.get('/users/purchases/all');
  return data.data;
}

export async function getSubscriptionStatus() {
  const { data } = await client.get('/users/purchases/subscription-status');
  return data.data;
}

export async function downloadInvoicePdf(invoiceId) {
  const response = await client.get(`/invoices/${invoiceId}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
}

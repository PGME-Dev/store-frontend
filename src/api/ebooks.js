import client from './client';

export async function getEbooks() {
  const { data } = await client.get('/books', { params: { ebook: true } });
  return data.data;
}

export async function getEbookById(bookId) {
  const { data } = await client.get(`/books/${bookId}`);
  return data.data;
}

export async function createEbookPaymentSession(bookId, billingAddress) {
  const { data } = await client.post('/ebook-orders/create-order', {
    book_id: bookId,
    billing_address: billingAddress,
  });
  return data.data;
}

export async function verifyEbookPayment(paymentSessionId, paymentId, signature) {
  const { data } = await client.post('/ebook-orders/verify-payment', {
    payment_session_id: paymentSessionId,
    payment_id: paymentId,
    signature,
  });
  return data.data;
}

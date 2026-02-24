import client from './client';

export async function getPackages() {
  const { data } = await client.get('/packages');
  return data.data;
}

export async function getPackageById(packageId) {
  const { data } = await client.get(`/packages/${packageId}`);
  return data.data;
}

export async function createPackagePaymentSession(packageId, billingAddress, tierIndex) {
  const { data } = await client.post('/payments/create-order', {
    package_id: packageId,
    billing_address: billingAddress,
    tier_index: tierIndex,
  });
  return data.data;
}

export async function verifyPackagePayment(paymentSessionId, paymentId, signature) {
  const { data } = await client.post('/payments/verify', {
    payment_session_id: paymentSessionId,
    payment_id: paymentId,
    signature,
  });
  return data.data;
}

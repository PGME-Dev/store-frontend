import client from './client';

export async function getPackageTypes() {
  const { data } = await client.get('/package-types');
  return data.data?.packageTypes || data.data || [];
}

export async function getPackages(subjectId) {
  const params = {};
  if (subjectId) params.subject_id = subjectId;
  const { data } = await client.get('/packages', { params });
  return data.data;
}

export async function getPackageById(packageId) {
  const { data } = await client.get(`/packages/${packageId}`);
  return data.data;
}

export async function createPackagePaymentSession(packageId, billingAddress, tierIndex, couponCode) {
  const { data } = await client.post('/payments/create-order', {
    package_id: packageId,
    billing_address: billingAddress,
    tier_index: tierIndex,
    coupon_code: couponCode || undefined,
  });
  return data.data;
}

/**
 * Preview a "complete your set" combo upgrade — how much credit the packages
 * already owned are worth, and the remaining amount to pay.
 */
export async function calculateComboUpgrade(packageId, targetTierIndex) {
  const { data } = await client.post('/payments/combo-upgrade/calculate', {
    package_id: packageId,
    target_tier_index: targetTierIndex ?? undefined,
  });
  return data.data;
}

export async function createComboUpgradeOrder(packageId, billingAddress, targetTierIndex, couponCode, termsAccepted) {
  const { data } = await client.post('/payments/combo-upgrade/create-order', {
    package_id: packageId,
    billing_address: billingAddress,
    target_tier_index: targetTierIndex ?? undefined,
    coupon_code: couponCode || undefined,
    terms_accepted: termsAccepted,
  });
  return data.data;
}

/** Preview a tier upgrade within a package the user already owns. */
export async function calculateTierUpgrade(packageId, targetTierIndex) {
  const { data } = await client.post('/payments/upgrade/calculate', {
    package_id: packageId,
    target_tier_index: targetTierIndex,
  });
  return data.data;
}

export async function createTierUpgradeOrder(packageId, billingAddress, targetTierIndex, couponCode, termsAccepted) {
  const { data } = await client.post('/payments/upgrade/create-order', {
    package_id: packageId,
    billing_address: billingAddress,
    target_tier_index: targetTierIndex,
    coupon_code: couponCode || undefined,
    terms_accepted: termsAccepted,
  });
  return data.data;
}

export async function verifyPackagePayment(paymentSessionId, paymentId, signature, termsAccepted) {
  const { data } = await client.post('/payments/verify', {
    payment_session_id: paymentSessionId,
    payment_id: paymentId,
    signature,
    terms_accepted: termsAccepted,
  });
  return data.data;
}

import client from './client';

/**
 * Preview a coupon for a prospective purchase (no invoice created).
 * @param {Object} payload
 *   { code, purchase_type, product_id?, tier_index?, items? }
 *   purchase_type: 'package' | 'session' | 'ebook' | 'book' | 'form'
 * @returns {Promise<Object>} { valid, beneficial, reason, coupon_discount, discounted_base, estimated_total }
 */
export async function validateCoupon(payload) {
  const { data } = await client.post('/coupons/validate', payload);
  return data.data;
}

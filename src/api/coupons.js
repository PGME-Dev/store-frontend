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

/**
 * List admin-marked-visible, currently-usable coupons for a prospective
 * purchase — shown as suggestion chips on checkout.
 * @param {Object} payload { purchase_type, product_id?, tier_index?, items? }
 * @returns {Promise<Array>} [{ code, description, discount_type, discount_value, max_discount_cap, min_order_value }]
 */
export async function listVisibleCoupons(payload) {
  const { data } = await client.post('/coupons/visible', payload);
  return data.data?.coupons || [];
}

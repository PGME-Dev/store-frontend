import client from './client';

/**
 * Cross-sell / upsell suggestions for a surface.
 * Works signed-out too (the endpoint uses optionalAuth) — guests just get
 * subject-based suggestions with no ownership filtering.
 *
 * @param {Object} params
 *   context: 'post_purchase' | 'product_detail' | 'my_purchases'
 *   productType: 'package' | 'ebook' | 'book' | 'session'
 *   productId, limit
 * @returns {Promise<Array>}
 */
export async function getRecommendations({ context, productType, productId, limit } = {}) {
  const { data } = await client.get('/recommendations', {
    params: {
      context,
      product_type: productType,
      product_id: productId,
      limit,
    },
  });
  return data.data?.recommendations || [];
}

import api from './api';

export async function getProductReviews(productId) {
  const { data } = await api.get(`/products/${productId}/reviews`);
  return data;
}

export async function createReview(productId, { rating, comment }) {
  const { data } = await api.post(`/products/${productId}/reviews`, { rating, comment });
  return data;
}

export async function deleteReview(reviewId) {
  await api.delete(`/reviews/${reviewId}`);
}

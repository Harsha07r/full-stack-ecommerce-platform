import api from './api';

function normalizeProduct(p) {
  return {
    ...p,
    id: p._id,
    category: p.category?.name ?? p.category,
    categoryId: p.category?._id ?? p.category,
  };
}

export async function getWishlist() {
  const { data } = await api.get('/wishlist');
  return data.map(normalizeProduct);
}

export async function addToWishlist(productId) {
  const { data } = await api.post(`/wishlist/${productId}`);
  return data.map(normalizeProduct);
}

export async function removeFromWishlist(productId) {
  const { data } = await api.delete(`/wishlist/${productId}`);
  return data.map(normalizeProduct);
}

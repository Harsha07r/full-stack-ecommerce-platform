import api from './api';

// Backend returns Mongo's `_id` and a populated category object; the rest of
// the app was built against a flat `id` string and a `category` name string,
// so normalize once here instead of touching every consumer.
function normalizeProduct(p) {
  return {
    ...p,
    id: p._id,
    category: p.category?.name ?? p.category,
  };
}

export async function getProducts() {
  const { data } = await api.get('/products');
  return data.map(normalizeProduct);
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return normalizeProduct(data);
}

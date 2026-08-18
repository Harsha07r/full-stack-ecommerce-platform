import api from './api';

// Backend returns Mongo's `_id` and a populated category object; the rest of
// the app was built against a flat `id` string and a `category` name string,
// so normalize once here instead of touching every consumer.
function normalizeProduct(p) {
  return {
    ...p,
    id: p._id,
    category: p.category?.name ?? p.category,
    categoryId: p.category?._id ?? p.category,
  };
}

// Maps the listing page's internal sort values to the API's wire format.
const SORT_PARAM = { 'price-asc': 'price_asc', 'price-desc': 'price_desc', name: 'name' };

export async function getProducts({ page, limit, search, category, sort, inStock } = {}) {
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (search) params.search = search;
  if (category && category !== 'All') params.category = category;
  if (sort && SORT_PARAM[sort]) params.sort = SORT_PARAM[sort];
  if (inStock) params.inStock = 'true';

  const { data } = await api.get('/products', { params });
  return { ...data, products: data.products.map(normalizeProduct) };
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return normalizeProduct(data);
}

// Writes take a flat `category` id (from an admin <select>), unlike the
// populated object reads return — no normalization needed going out.
export async function createProduct(payload) {
  const { data } = await api.post('/products', payload);
  return normalizeProduct(data);
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return normalizeProduct(data);
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}

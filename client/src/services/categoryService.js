import api from './api';

export async function getCategories() {
  const { data } = await api.get('/categories');
  return data;
}

export async function createCategory(name) {
  const { data } = await api.post('/categories', { name });
  return data;
}

export async function updateCategory(id, name) {
  const { data } = await api.put(`/categories/${id}`, { name });
  return data;
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`);
}

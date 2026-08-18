import { useState } from 'react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import { useCategories } from '../../hooks/useCategories';
import { createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

export default function AdminCategories() {
  const { categories, loading, error, refresh } = useCategories();
  const [newName, setNewName] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setFormError('');
    setSubmitting(true);
    try {
      await createCategory(newName.trim());
      setNewName('');
      await refresh();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not create category.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
  };

  const saveEdit = async (id) => {
    if (!editingName.trim()) return;
    try {
      await updateCategory(id, editingName.trim());
      setEditingId(null);
      await refresh();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not update category.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Products using it will keep a reference to a category that no longer exists.')) return;
    try {
      await deleteCategory(id);
      await refresh();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not delete category.');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Categories</h1>

      <form onSubmit={handleCreate} className="mt-8 flex max-w-md items-end gap-3">
        <div className="flex-1">
          <FormField
            label="New category"
            name="newCategory"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Accessories"
          />
        </div>
        <Button type="submit" disabled={submitting}>
          Add
        </Button>
      </form>

      {formError && <p className="mt-3 text-sm text-sale">{formError}</p>}

      {loading && <p className="mt-10 text-sm text-muted">Loading…</p>}
      {error && <p className="mt-10 text-sm text-sale">{error}</p>}

      {!loading && !error && (
        <ul className="mt-10 max-w-md divide-y divide-line border-y border-line">
          {categories.length === 0 && <li className="py-6 text-sm text-muted">No categories yet.</li>}
          {categories.map((c) => (
            <li key={c._id} className="flex items-center justify-between gap-4 py-3">
              {editingId === c._id ? (
                <>
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                  <div className="flex gap-3 text-[10px] uppercase tracking-[0.16em]">
                    <button onClick={() => saveEdit(c._id)} className="underline underline-offset-4 hover:opacity-55">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-muted underline underline-offset-4 hover:opacity-55">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm">{c.name}</span>
                  <div className="flex gap-3 text-[10px] uppercase tracking-[0.16em]">
                    <button onClick={() => startEdit(c)} className="underline underline-offset-4 hover:opacity-55">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-sale underline underline-offset-4 hover:opacity-70"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

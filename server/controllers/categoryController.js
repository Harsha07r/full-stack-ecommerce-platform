import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const slugify = (name) => name.toLowerCase().trim().replace(/\s+/g, '-');

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const update = name ? { name, slug: slugify(name) } : {};
  const category = await Category.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ message: 'Category deleted' });
});

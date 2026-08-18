import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const SORTS = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  name: { name: 1 },
  featured: { createdAt: -1 },
};

export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 8);
  const { search, category, sort, inStock } = req.query;

  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (inStock === 'true') filter['sizes.stock'] = { $gt: 0 };
  if (category) {
    const cat = await Category.findOne({ name: category });
    // An unknown category name should return an empty page, not every product.
    filter.category = cat ? cat._id : null;
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(SORTS[sort] || SORTS.featured)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ products, page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ message: 'Product deleted' });
});

import User from '../models/User.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    populate: { path: 'category', select: 'name slug' },
  });
  res.json(user.wishlist);
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await User.updateOne({ _id: req.user._id }, { $addToSet: { wishlist: productId } });
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    populate: { path: 'category', select: 'name slug' },
  });
  res.json(user.wishlist);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  await User.updateOne({ _id: req.user._id }, { $pull: { wishlist: productId } });
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    populate: { path: 'category', select: 'name slug' },
  });
  res.json(user.wishlist);
});

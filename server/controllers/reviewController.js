import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  const count = reviews.length;
  const averageRating = count === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / count;

  res.json({ reviews, averageRating, count });
});

export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be a whole number between 1 and 5');
  }
  if (!comment?.trim() || comment.length > 500) {
    res.status(400);
    throw new Error('Comment is required and must be under 500 characters');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
  if (alreadyReviewed) {
    res.status(409);
    throw new Error('You have already reviewed this product');
  }

  const hasPurchased = await Order.exists({
    user: req.user._id,
    status: { $ne: 'cancelled' },
    'items.product': productId,
  });
  if (!hasPurchased) {
    res.status(403);
    throw new Error('You can only review products you have purchased');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment: comment.trim(),
  });
  await review.populate('user', 'name');

  res.status(201).json(review);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only delete your own review');
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted' });
});

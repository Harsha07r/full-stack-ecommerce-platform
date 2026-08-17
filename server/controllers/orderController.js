import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, subtotal, shipping, total } = req.body;
  if (!items?.length) {
    res.status(400);
    throw new Error('Order must include at least one item');
  }
  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address is required');
  }

  // Validate stock for every line before touching any of them, so a failure
  // partway through never leaves stock decremented for only some items.
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(400);
      throw new Error(`${item.name} is no longer available`);
    }
    const sizeEntry = product.sizes.find((s) => s.size === item.size);
    if (!sizeEntry || sizeEntry.stock < item.quantity) {
      res.status(409);
      throw new Error(`${item.name} (${item.size}) is out of stock`);
    }
  }

  for (const item of items) {
    await Product.updateOne(
      { _id: item.product, 'sizes.size': item.size },
      { $inc: { 'sizes.$.stock': -item.quantity } }
    );
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    subtotal,
    shipping,
    total,
  });
  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${allowed.join(', ')}`);
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

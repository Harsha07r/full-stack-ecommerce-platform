import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { categoryNames, products } from './data.js';

const slugify = (name) => name.toLowerCase().trim().replace(/\s+/g, '-');

async function importData() {
  await connectDB();

  await Product.deleteMany();
  await Category.deleteMany();

  const categories = await Category.insertMany(
    categoryNames.map((name) => ({ name, slug: slugify(name) }))
  );
  const categoryIdByName = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  await Product.insertMany(products.map((p) => ({ ...p, category: categoryIdByName[p.category] })));

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@marlow.test').toLowerCase();
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    await User.create({
      name: 'Marlow Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
      role: 'admin',
    });
  }

  console.log(
    `Seeded ${categories.length} categories, ${products.length} products, admin user ready (${adminEmail})`
  );
  await mongoose.connection.close();
  process.exit(0);
}

async function destroyData() {
  await connectDB();
  await Product.deleteMany();
  await Category.deleteMany();
  await User.deleteMany();
  console.log('All data destroyed');
  await mongoose.connection.close();
  process.exit(0);
}

if (process.argv.includes('--destroy')) {
  destroyData();
} else {
  importData();
}

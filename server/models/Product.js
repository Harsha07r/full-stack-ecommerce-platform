import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    colour: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: [String], default: [] },
    sizes: { type: [sizeSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },   // Sofa, Bed, Dining, Wardrobe, etc.
  price: { type: Number, required: true },
  description: String,
  image: String,                                 // path in /uploads
  branch: { type: String, enum: ['Chennai', 'Karur', 'Both'], default: 'Both' },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

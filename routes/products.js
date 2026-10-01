const express = require('express');
const router = express.Router();
const multer = require('multer');
const { put } = require('@vercel/blob');
const Product = require('../models/Product');

// Image upload setup
const upload = multer({ storage: multer.memoryStorage() });

// GET all products (with optional ?category= filter)
router.get('/', async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {};
  const products = await Product.find(filter).sort('-createdAt');
  res.json(products);
});

// GET single product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST create product (protected by admin key)
router.post('/', upload.single('image'), async (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: 'Unauthorized' });
  const data = { ...req.body, price: Number(req.body.price) };
if (req.file) {
  const blob = await put(req.file.originalname, req.file.buffer, {
    access: 'public',
    addRandomSuffix: true
  });

  data.image = blob.url;
}
  const product = await Product.create(data);
  res.status(201).json(product);
});

// PUT update product
router.put('/:id', async (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: 'Unauthorized' });
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// DELETE product
router.delete('/:id', async (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: 'Unauthorized' });
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;

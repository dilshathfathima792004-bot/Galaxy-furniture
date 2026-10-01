const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.get('/', async (req, res) => {
  const blogs = await Blog.find().sort('-createdAt');
  res.json(blogs);
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

router.post('/', async (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: 'Unauthorized' });
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
});

router.delete('/:id', async (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: 'Unauthorized' });
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;

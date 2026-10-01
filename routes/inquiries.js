const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Inquiry = require('../models/Inquiry');

// POST: customer sends an inquiry (from contact page / product page)
router.post('/', async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    // Optional: email notification to showroom
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS !== 'your_app_password_here') {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New inquiry from ${inquiry.name}`,
        text: `Name: ${inquiry.name}\nPhone: ${inquiry.phone}\nEmail: ${inquiry.email || '-'}\n\n${inquiry.message}`
      });
    }
    res.status(201).json({ success: true, id: inquiry._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all inquiries (admin)
router.get('/', async (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: 'Unauthorized' });
  const inquiries = await Inquiry.find().sort('-createdAt');
  res.json(inquiries);
});

// PATCH update status
router.patch('/:id', async (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: 'Unauthorized' });
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(inquiry);
});

module.exports = router;

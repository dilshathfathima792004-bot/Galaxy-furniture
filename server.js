require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/inquiries', require('./routes/inquiries'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB (works both locally and on Vercel)
let cached = null;
async function connectDB() {
  if (cached) return cached;
  cached = await mongoose.connect(process.env.MONGO_URI);
  return cached;
}
connectDB().then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB failed:', err.message));

// IMPORTANT: export for Vercel (serverless) — no app.listen() here
module.exports = app;

// LOCAL MODE: only listen when run directly (npm run dev on your laptop)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Local server: http://localhost:${PORT}`));
}

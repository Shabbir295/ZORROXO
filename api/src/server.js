import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js'; // 🔥 Admin Routes Import

// Agar aapke paas baaki routes hain (jaise products, orders), toh unko yahan import karein
// import productRoutes from './routes/productRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 Admin API Route (Password Reset ke liye)
app.use('/api/admin', adminRoutes);

// Baaki Routes (Agar aapke paas hain toh inko uncomment karein)
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('ZORROXO Backend API is running successfully!');
});

// Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});
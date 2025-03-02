import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables from .env
dotenv.config();

// Environment variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debugging: Check if environment variables are loaded
console.log("🔍 Checking environment variables...");
console.log("✅ MONGO_URI:", MONGO_URI ? "Found" : "❌ Not Found");
console.log("✅ JWT_SECRET:", JWT_SECRET ? "Found" : "❌ Not Found");
console.log("✅ CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "Found" : "❌ Not Found");
console.log("✅ CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "Found" : "❌ Not Found");
console.log("✅ CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Found" : "❌ Not Found");

// MongoDB connection
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB is connected');
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
    });

const __dirname = path.resolve();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}!`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
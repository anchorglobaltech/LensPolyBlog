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

// Load environment variables
dotenv.config();

// Environment variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate essential environment variables
if (!MONGO_URI || !JWT_SECRET) {
    console.error("❌ Missing required environment variables! Check your .env file.");
    process.exit(1); // Exit the app if critical variables are missing
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debugging: Check environment variables
console.log("🔍 Checking environment variables...");
console.log("✅ MONGO_URI:", "Found");
console.log("✅ JWT_SECRET:", "Found");
console.log("✅ CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "Found" : "❌ Not Found");
console.log("✅ CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "Found" : "❌ Not Found");
console.log("✅ CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Found" : "❌ Not Found");

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit if DB connection fails
    });

const __dirname = path.resolve();
const app = express();

// Middleware - Increase request size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Serve frontend (React Build)
const frontendPath = path.join(__dirname, 'public');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}!`));

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error("❌ Error:", message);
    res.status(statusCode).json({ success: false, statusCode, message });
});

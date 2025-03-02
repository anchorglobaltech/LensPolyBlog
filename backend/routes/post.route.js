import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken } from "../utils/verifyUser.js";
import { getTrendingPosts, create, deletepost, getposts, updatepost } from "../controllers/post.controller.js";
import { errorHandler } from "../utils/error.js";
const router = express.Router();

// Multer storage setup for handling file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Route for uploading an image to Cloudinary
router.post("/upload-image", verifyToken, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No file uploaded"));
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "posts",
    });

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    next(error);
  }
});

// Post-related routes
router.post("/create", verifyToken, create);
router.get('/getposts', getposts)
router.get("/getTrendingPosts", getTrendingPosts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)

export default router;

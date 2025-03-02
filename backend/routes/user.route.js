import express from "express";
import multer from "multer";
import {
  deleteUser,
  test,
  updateUser,
  signout,
  getUsers,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import User from "../models/user.model.js"; // Ensure this exists

dotenv.config();

const router = express.Router();

// Multer Configuration (Restrict file types & size)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit: 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
});

// Test route
router.get("/test", test);

// Get all users (Admin only)
router.get("/", verifyToken, getUsers);

// Get a single user (Only logged-in users can access)
router.get("/:userId", verifyToken, getUser);

// Update user profile (User must be authenticated)
router.put("/update/:userId", verifyToken, updateUser);

// Delete user (Only the user themselves or an admin can delete)
router.delete("/:userId", verifyToken, deleteUser);

// Sign out user
router.post("/signout", signout);

// Upload & Update Profile Picture
router.post(
  "/upload-profile-picture",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      // Update user profile in MongoDB
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: result.secure_url },
        { new: true }
      );

      res.status(200).json({ imageUrl: result.secure_url, user });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export default router;

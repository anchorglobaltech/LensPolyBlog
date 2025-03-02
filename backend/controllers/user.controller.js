import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const test = (req, res) => {
  res.json({ message: "Test API is working" });
};

// Configure multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

// Upload profile picture and update user
export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, 'No file uploaded.'));
    }

    console.log("✅ Uploaded Image URL:", req.file.path); // Debugging

    res.status(200).json({
      message: 'Profile picture uploaded successfully!',
      imageUrl: req.file.path, // Cloudinary URL
    });
  } catch (error) {
    console.error("❌ Image Upload Error:", error);
    next(error);
  }
};

// Update user profile
export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this user"));
    }

    const updates = { ...req.body };

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters"));
      }
      updates.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(errorHandler(400, "Username must be between 7 and 20 characters"));
      }
      if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, "Username must be lowercase"));
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400, "Username can only contain letters and numbers"));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: updates }, { new: true });

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this user'));
    }

    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};

// Sign out
export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token', { path: '/' });
    res.status(200).json({ message: "User has been signed out" });
  } catch (error) {
    next(error);
  }
};

// Get all users (Admin only)
export const getUsers = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to see all the users'));
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthCount = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthCount,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

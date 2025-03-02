import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  let token = req.cookies.access_token; // First check the cookie

  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1]; // Get token from "Bearer <token>"
  }

  if (!token) {
    return next(errorHandler(401, 'Unauthorized - No Token Provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, 'Forbidden - Invalid Token')); // Change 401 → 403 for invalid tokens
    }
    req.user = user;
    next();
  });
};

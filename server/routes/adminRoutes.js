import express from 'express';
import {
  getAllTeacherApplications,
  updateTeacherStatus,
  getDashboardStats
} from '../controller/adminController.js';

import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// GET /api/admin/teachers
router.get('/teachers', verifyToken, isAdmin, getAllTeacherApplications);

// PATCH /api/admin/teacher/:id
router.patch('/teacher/:id', verifyToken, isAdmin, updateTeacherStatus);


router.get('/stats', verifyToken, isAdmin, getDashboardStats);
export default router;

import express from 'express';
import {
  getAllTeacherApplications,
  updateTeacherStatus,
  getDashboardStats,
  getAllTestsWithTeacher,
  getAdminTestDetails,
  getAdminTestEnrolledDetails
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

//GET /api/admin/stats
router.get('/stats', verifyToken, isAdmin, getDashboardStats);

//GET /api/admin/tests
router.get('/tests', verifyToken ,isAdmin, getAllTestsWithTeacher);

// routes/admin.js
router.get('/test/details/:id', verifyToken, isAdmin, getAdminTestDetails);

//GET /admin/test/:id/enrollments
router.get('/test/:id/enrollments', verifyToken, isAdmin,getAdminTestEnrolledDetails);

export default router;

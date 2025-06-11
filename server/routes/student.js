// routes/student.js
import express from 'express';
import { updateStudentProfile, getStudentProfile } from '../controller/studentController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// GET current student's profile
router.get('/me', verifyToken, getStudentProfile);

// POST or PUT student profile
router.post('/update', verifyToken, updateStudentProfile);

export default router;

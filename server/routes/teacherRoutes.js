import express from 'express';
import { applyForTeacher ,getTeacherApplication } from '../controller/teacherController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/teacher/apply
router.post('/apply', verifyToken, applyForTeacher);

// GET /api/teacher/application
router.get('/application', verifyToken, getTeacherApplication);


export default router;


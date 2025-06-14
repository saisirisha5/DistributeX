import express from 'express';
import { getAllTests, getTestById, enrollInTest , getEnrolledTests } from '../controller/studentTestController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/tests', verifyToken, getAllTests);
router.post('/tests/enroll', verifyToken, enrollInTest);
router.get('/tests/viewEnrolled', verifyToken, getEnrolledTests);
router.get('/tests/:id', verifyToken, getTestById);

export default router;

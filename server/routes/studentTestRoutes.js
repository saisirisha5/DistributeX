import express from 'express';
import { getAllTests, getTestById, enrollInTest } from '../controller/studentTestController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/tests', verifyToken, getAllTests);
router.get('/tests/:id', verifyToken, getTestById);
router.post('/tests/enroll', verifyToken, enrollInTest);

export default router;

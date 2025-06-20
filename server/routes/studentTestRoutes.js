import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { getAllTests, getTestById, enrollInTest , getEnrolledTests} from '../controller/studentTestController.js';
import { createOrder, verifyPayment } from '../controller/paymentController.js';

const router = express.Router();

router.get('/tests', verifyToken, getAllTests);
router.post('/tests/enroll', verifyToken, enrollInTest);
router.get('/tests/viewEnrolled', verifyToken, getEnrolledTests);
router.post('/tests/createOrder', verifyToken, createOrder);
router.post('/tests/verifyPayment', verifyToken, verifyPayment);


//this route is more generic so it might conflict with other routes which are get by some id
router.get('/tests/:id', verifyToken, getTestById);

export default router;

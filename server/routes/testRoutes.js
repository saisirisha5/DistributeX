import express from 'express';
import { createTest ,getMyTests , getTestDetails} from '../controller/testController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/test/create
router.post('/create', verifyToken, createTest);

// GET /api/test/my-tests
router.get('/my-tests', verifyToken, getMyTests);

// GET /api/test/details/:id
router.get('/details/:id', verifyToken, getTestDetails);

export default router;

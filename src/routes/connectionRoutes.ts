import express from 'express';
import {
    generateConnections,
    acceptConnection,
    rejectConnection
} from '../controllers/connnectionController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Generate Connections route
router.get('/generate/:userId', authMiddleware, generateConnections);

// Accept connection route
router.put('/accept/:connectionId', authMiddleware, acceptConnection);

// Reject connection route
router.put('/reject/:connectionId', authMiddleware, rejectConnection);

export default router;

import express, { Request, Response } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getUserConnections,
} from '../controllers/connnectionController';

const router = express.Router();

// Send Connection Request route
router.post('/connections/:receiverId', authMiddleware, sendConnectionRequest);

// Accept Connection Request route
router.post('/connections/:requestId/accept', authMiddleware, acceptConnectionRequest);

// Reject Connection Request route
router.post('/connections/:requestId/reject', authMiddleware, rejectConnectionRequest);

// Get User Connections route
router.get('/connections', authMiddleware, getUserConnections);

export default router;

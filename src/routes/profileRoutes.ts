import express, { Request, Response } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
} from '../controllers/profileController';

const router = express.Router();

// Create Profile route
router.post('/', authMiddleware, createProfile);

// Get Profile route
router.get('/', authMiddleware, getProfile);

// Update Profile route
router.put('/', authMiddleware, updateProfile);

// Delete Profile route
router.delete('/', authMiddleware, deleteProfile);

export default router;

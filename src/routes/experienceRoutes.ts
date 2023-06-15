import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    createExperience,
    getExperienceByUserId,
    updateExperience,
    deleteExperience,
} from '../controllers/experienceController';

const router = express.Router();

// Create Experience route
router.post('/', authMiddleware, createExperience);

// Get Experience by User ID route
router.get('/', authMiddleware, getExperienceByUserId);

// Update Experience route
router.put('/:experience_id', authMiddleware, updateExperience);

// Delete Experience route
router.delete('/:experience_id', authMiddleware, deleteExperience);

export default router;

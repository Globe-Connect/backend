import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    createEducation,
    getEducationByUserId,
    updateEducation,
    deleteEducation,
} from '../controllers/educationController';

const router = express.Router();

// Create Education route
router.post('/', authMiddleware, createEducation);

// Get Education by User ID route
router.get('/', authMiddleware, getEducationByUserId);

// Update Education route
router.put('/:education_id', authMiddleware, updateEducation);

// Delete Education route
router.delete('/:education_id', authMiddleware, deleteEducation);

export default router;

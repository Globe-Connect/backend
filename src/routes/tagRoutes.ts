import express, { Request, Response } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    createTag,
    updateTag,
    getAllTags,
    getTagbyId,
    deleteTag
} from '../controllers/tagController';

const router = express.Router();

// Create Post route
router.post('/', authMiddleware, createTag);

// Get All Posts route
router.get('/', authMiddleware, getAllTags);

// Get Post by ID route
router.get('/:tagId', authMiddleware, getTagbyId);

// Update Post route
router.put('/:tagId', authMiddleware, updateTag);

// Delete Post route
router.delete('/:tagId', authMiddleware, deleteTag);

export default router;

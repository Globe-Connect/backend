import express, { Request, Response } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
} from '../controllers/postController';

const router = express.Router();

// Create Post route
router.post('/', authMiddleware, createPost);

// Get All Posts route
router.get('/', authMiddleware, getAllPosts);

// Get Post by ID route
router.get('/:postId', authMiddleware, getPostById);

// Update Post route
router.put('/:postId', authMiddleware, updatePost);

// Delete Post route
router.delete('/:postId', authMiddleware, deletePost);

// Like Post route
router.post('/:postId/like', authMiddleware, likePost);

// Unlike Post route
router.post('/:postId/unlike', authMiddleware, unlikePost);

export default router;

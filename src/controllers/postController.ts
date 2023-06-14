import { Request, Response } from 'express';
import {IPost, Post} from "../models/post";

interface CustomRequest extends Request {
    user?: {
        id: string;
    };
}


// Create Post
export const createPost = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { content, image, tags } = req.body;

        const newPost: IPost = new Post({
            user_id: userId,
            content,
            post_date: Date.now(),
            tags,
            image,
            likes_count: 0
        });

        const savedPost: IPost = await newPost.save();

        res.status(201).json({ post: savedPost });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
};

// Get All Posts
export const getAllPosts = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const posts: IPost[] = await Post.find().populate('likes').populate('tags');

        res.json({ posts });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// Get Post by ID
export const getPostById = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId;

        const post: IPost | null = await Post.findById(postId).populate('likes');

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json({ post });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

// Update Post
export const updatePost = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId;
        const { content, image } = req.body;

        const updatedPost: IPost | null = await Post.findByIdAndUpdate(
            postId,
            { content, image },
            { new: true }
        ).populate('likes');

        if (!updatedPost) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json({ post: updatedPost });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};

// Delete Post
export const deletePost = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId;

        const deletedPost: IPost | null = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

// Like Post
export const likePost = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId;
        const userId = req.user?.id;

        const updatedPost: IPost | null = await Post.findByIdAndUpdate(
            postId,
            {
                $addToSet: { likes: userId },
                $inc: { likes_count: 1 } // Increment likes_count by 1
            },
            { new: true }
        ).populate('likes');

        if (!updatedPost) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json({ post: updatedPost });
    } catch (error) {
        res.status(500).json({ error: 'Failed to like post' });
    }
};

// Unlike Post
export const unlikePost = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId;
        const userId = req.user?.id;

        const updatedPost: IPost | null = await Post.findByIdAndUpdate(
            postId,
            {
                $pull: { likes: userId },
                $inc: { likes_count: -1 } // Decrement likes_count by 1
            },
            { new: true }
        ).populate('likes');

        if (!updatedPost) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json({ post: updatedPost });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unlike post' });
    }
};

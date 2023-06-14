import { Request, Response } from 'express';
import {ITag, Tag} from "../models/tag";


// Create Post
export const createTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;

        const newTag: ITag = new Tag({
            name,
            followed : 0,
            posts: 0
        });

        const savedTag: ITag = await newTag.save();

        res.status(201).json({ post: savedTag });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create tag' });
    }
};

// Get All Posts
export const getAllTags = async (req: Request, res: Response): Promise<void> => {
    try {
        const tags: ITag[] = await Tag.find();

        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
};

// Get Post by ID
export const getTagbyId = async (req: Request, res: Response): Promise<void> => {
    try {
        const tagId = req.params.tagId;

        const tag: ITag | null = await Tag.findById(tagId);

        if (!tag) {
            res.status(404).json({ error: 'Tag not found' });
            return;
        }

        res.json({ tag });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tag' });
    }
};

// Update Post
export const updateTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const tagId = req.params.tagId;
        const { name, followed, } = req.body;

        const updatedTag: ITag | null = await Tag.findByIdAndUpdate(
            tagId,
            name,
            { new: true }
        );

        if (!updatedTag) {
            res.status(404).json({ error: 'Tag not found' });
            return;
        }

        res.json({ post: updatedTag });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};

// Delete Post
export const deleteTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const tagId = req.params.potagIdstId;

        const deletedPost: ITag | null = await Tag.findByIdAndDelete(tagId);

        if (!deletedPost) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tag' });
    }
};

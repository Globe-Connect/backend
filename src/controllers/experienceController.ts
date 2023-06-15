import { Request, Response } from 'express';
import { Experience, IExperience } from '../models/experience';

interface CustomRequest extends Request {
    user?: {
        id: string;
    };
}

// Create Experience
export const createExperience = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { company_name, title, location, start_date, end_date } = req.body;
        const userId = req.user?.id;

        const newExperience: IExperience = new Experience({
            user_id: userId,
            company_name,
            title,
            location,
            start_date,
            end_date,
        });

        const savedExperience: IExperience = await newExperience.save();

        res.status(201).json({ experience: savedExperience });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create experience' });
    }
};

// Get Experience by User ID
export const getExperienceByUserId = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        const experience: IExperience[] = await Experience.find({ user_id: userId });

        res.json({ experience });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch experience' });
    }
};

// Update Experience
export const updateExperience = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { experience_id } = req.params;
        const { company_name, title, location, start_date, end_date } = req.body;
        const userId = req.user?.id;

        const updatedExperience: IExperience | null = await Experience.findOneAndUpdate(
            { _id: experience_id, user_id: userId },
            { company_name, title, location, start_date, end_date },
            { new: true }
        );

        if (!updatedExperience) {
            res.status(404).json({ error: 'Experience not found' });
            return;
        }

        res.json({ experience: updatedExperience });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update experience' });
    }
};

// Delete Experience
export const deleteExperience = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { experience_id } = req.params;
        const userId = req.user?.id;

        const deletedExperience: IExperience | null = await Experience.findOneAndDelete({
            _id: experience_id,
            user_id: userId,
        });

        if (!deletedExperience) {
            res.status(404).json({ error: 'Experience not found' });
            return;
        }

        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete experience' });
    }
};

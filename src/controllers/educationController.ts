import { Request, Response } from 'express';
import { Education, IEducation } from '../models/education';

interface CustomRequest extends Request {
    user?: {
        id: string;
    };
}

// Create Education
export const createEducation = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { school_name, degree, field_of_study, start_date, end_date } = req.body;
        const userId = req.user?.id;

        const newEducation: IEducation = new Education({
            user_id: userId,
            school_name,
            degree,
            field_of_study,
            start_date,
            end_date,
        });

        const savedEducation: IEducation = await newEducation.save();

        res.status(201).json({ education: savedEducation });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create education' });
    }
};

// Get Education by User ID
export const getEducationByUserId = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        const education: IEducation[] = await Education.find({ user_id: userId });

        res.json({ education });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch education' });
    }
};

// Update Education
export const updateEducation = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { education_id } = req.params;
        const { school_name, degree, field_of_study, start_date, end_date } = req.body;
        const userId = req.user?.id;

        const updatedEducation: IEducation | null = await Education.findOneAndUpdate(
            { _id: education_id, user_id: userId },
            { school_name, degree, field_of_study, start_date, end_date },
            { new: true }
        );

        if (!updatedEducation) {
            res.status(404).json({ error: 'Education not found' });
            return;
        }

        res.json({ education: updatedEducation });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update education' });
    }
};

// Delete Education
export const deleteEducation = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { education_id } = req.params;
        const userId = req.user?.id;

        const deletedEducation: IEducation | null = await Education.findOneAndDelete({
            _id: education_id,
            user_id: userId,
        });

        if (!deletedEducation) {
            res.status(404).json({ error: 'Education not found' });
            return;
        }

        res.json({ message: 'Education deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete education' });
    }
};

import { Request, Response } from 'express';
import { Profile, IProfile } from '../models/profile';

interface CustomRequest extends Request {
    user?: {
        id: string;
    };
}

// Create Profile
export const createProfile = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Retrieve user ID from the authenticated user
        // Extract necessary fields from the request body
        const { headline, summary, industry, website, tags } = req.body;

        console.log(userId);

        const newProfile: IProfile = new Profile({
            user_id: userId,
            headline,
            summary,
            industry,
            website,
            tags
        });

        const savedProfile: IProfile = await newProfile.save();

        res.status(201).json({ profile: savedProfile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create profile' });
    }
};

// Get Profile
export const getProfile = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Retrieve user ID from the authenticated user

        const profile: IProfile | null = await Profile.findOne({ user_id: userId }).populate('tags').populate('connections');

        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        res.json({ profile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};


// Update Profile
export const updateProfile = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Retrieve user ID from the authenticated user
        // Extract necessary fields from the request body
        const { headline, summary, industry, website, tags } = req.body;

        const updatedProfile: IProfile | null = await Profile.findOneAndUpdate(
            { user_id: userId },
            {
                headline,
                summary,
                industry,
                website,
                tags
            },
            { new: true }
        ).populate('tags');

        if (!updatedProfile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        res.json({ profile: updatedProfile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Delete Profile
export const deleteProfile = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Retrieve user ID from the authenticated user

        const deletedProfile: IProfile | null = await Profile.findOneAndDelete({ user_id: userId });

        if (!deletedProfile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete profile' });
    }
};

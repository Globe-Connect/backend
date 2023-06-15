import { Request, Response } from 'express';
import { Profile, IProfile } from '../models/profile';

interface CustomRequest extends Request {
    user?: {
        id: string;
    };
}

// Send Connection Request
export const sendConnectionRequest = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    try {
        const senderId = req.user?.id;
        const receiverId = req.params.receiverId;

        const senderProfile: IProfile | null = await Profile.findOne({
            user_id: senderId,
        });
        const receiverProfile: IProfile | null = await Profile.findOne({
            user_id: receiverId,
        });

        if (!senderProfile || !receiverProfile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        // Check if a connection request already exists
        const existingRequest = senderProfile.connections.find(
            (request) => request.user_id.toString() === receiverId
        );

        if (existingRequest) {
            res.status(400).json({ error: 'Connection request already sent' });
            return;
        }

        senderProfile.connections.push({
            user_id: receiverId,
            status: 'pending',
        });

        await senderProfile.save();

        res.json({ message: 'Connection request sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send connection request' });
    }
};

// Accept Connection Request
export const acceptConnectionRequest = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    try {
        const receiverId = req.user?.id;
        const senderId = req.params.senderId;

        const receiverProfile: IProfile | null = await Profile.findOne({
            user_id: receiverId,
        });

        if (!receiverProfile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        const connectionRequest = receiverProfile.connections.find(
            (request) =>
                request.user_id.toString() === senderId && request.status === 'pending'
        );

        if (!connectionRequest) {
            res.status(400).json({ error: 'Connection request not found' });
            return;
        }

        connectionRequest.status = 'accepted';

        await receiverProfile.save();

        res.json({ message: 'Connection request accepted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept connection request' });
    }
};

// Reject Connection Request
export const rejectConnectionRequest = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    try {
        const receiverId = req.user?.id;
        const senderId = req.params.senderId;

        const receiverProfile: IProfile | null = await Profile.findOne({
            user_id: receiverId,
        });

        if (!receiverProfile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        const connectionRequest = receiverProfile.connections.find(
            (request) =>
                request.user_id.toString() === senderId && request.status === 'pending'
        );

        if (!connectionRequest) {
            res.status(400).json({ error: 'Connection request not found' });
            return;
        }

        connectionRequest.status = 'rejected';

        await receiverProfile.save();

        res.json({ message: 'Connection request rejected' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject connection request' });
    }
};

// Get User's Connections
export const getUserConnections = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.id;

        const profile: IProfile | null = await Profile.findOne({
            user_id: userId,
        }).populate('connections.user_id');

        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        const connections = profile.connections.filter(
            (request) => request.status === 'accepted'
        );

        res.json({ connections });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch connections' });
    }
};

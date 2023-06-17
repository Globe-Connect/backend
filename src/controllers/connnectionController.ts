import { Request, Response } from 'express';
import { Connection, IConnection } from '../models/connection';
import { User, IUser } from '../models/user';
import { Profile } from "../models/profile";

interface CustomRequest extends Request {
    user?: {
        id: string;
    };
    params: {
        userId: string;
        connectionId: string;
    };
}

// Generate Connections based on user's state and country
export const generateConnections = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Retrieve user ID from the authenticated user
        const otherUserId = req.params.userId; // Retrieve other user ID from the request parameters

        // Get the authenticated user's state and country
        const user: IUser | null = await User.findOne({ _id: userId });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userState = user.state;
        const userCountry = user.country;

        // Get the other user's state and country
        const otherUser: IUser | null = await User.findOne({ _id: otherUserId });

        if (!otherUser) {
            res.status(404).json({ error: 'Other user not found' });
            return;
        }

        const otherUserState = otherUser.state;
        const otherUserCountry = otherUser.country;

        // Determine the connection level based on the states
        let level = 0;

        if (userState === otherUserState) {
            level = 1;
        } else if (userCountry === otherUserCountry) {
            level = 2;
        } else {
            level = 3;
        }

        // Create a new connection
        const newConnection: IConnection = new Connection({
            fromUserId: userId,
            toUserId: otherUserId,
            status: 'pending',
            level: level,
        });

        // Find the user profile by user ID
        const userProfile = await Profile.findOne({ user_id: userId });

        if (!userProfile) {
            throw new Error('User profile not found');
        }

        const savedConnection = await newConnection.save();

        // Update the user profile with the new connection ID
        userProfile.connections.push(savedConnection._id);
        await userProfile.save();

        res.json({ message: 'Connection request sent' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate connections' });
    }
};

// Accept a connection request
export const acceptConnection = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Retrieve user ID from the authenticated user
        const connectionId = req.params.connectionId; // Retrieve connection ID from the request parameters

        console.log(connectionId);

        // Find the connection and update its status to 'accepted'
        const connection: IConnection | null = await Connection.findOneAndUpdate(
            { _id: connectionId }, // Find the connection by ID and the authenticated user as the recipient
            { status: 'accepted' },
            { new: true }
        );

        if (!connection) {
            res.status(404).json({ error: 'Connection not found' });
            return;
        }

        // Update user profiles
        const userTwoProfile = await Profile.findOne({ user_id: connection.toUserId });

        if (!userTwoProfile) {
            throw new Error('User profile not found');
        }

        userTwoProfile.connections.push(connection);

        await Promise.all([ userTwoProfile.save()]);

        res.json({ connection });
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept connection' });
    }
};

// Reject a connection request
export const rejectConnection = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const connectionId = req.params.connectionId; // Retrieve connection ID from the request parameters

        // Find the connection
        const connection : IConnection | null = await Connection.findById(connectionId);

        if (!connection) {
            res.status(404).json({ error: 'Connection not found' });
            return;
        }

        const fromUserId = connection.fromUserId;

        // Delete the connection document
        await Connection.findByIdAndDelete({ _id: connectionId });

        // Update user profile
        const userProfile = await Profile.findOne({ user_id: fromUserId });

        if (!userProfile) {
            throw new Error('User profile not found');
        }

        // Remove connection object from user profile
        userProfile.connections = userProfile.connections.filter((conn) => conn.toString() !== connectionId);

        await userProfile.save();

        res.json({ "msg" :"Connection Request Rejected" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject connection' });
    }
};


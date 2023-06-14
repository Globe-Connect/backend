import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {IUser, User} from '../models/user';

interface CustomRequest extends Request {
    user?: IUser; // Add the user property to the Request type
}

const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Check if the token is provided
        const token = req.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }

        // Extract the token value without the "Bearer " prefix
        const tokenValue = token.split(' ')[1];


        try {
            // Verify and decode the token to extract the user ID
            const decoded = jwt.verify(tokenValue, "hello-kitty") as { userId: string };

            // Find the user by ID
            const user = await User.findById(decoded.userId);
            if (!user) {
                res.status(404).json({ error: 'User not found.' });
                return;
            }

            // Attach the user object to the request for further processing
            req.user = user;

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: 'Invalid token.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to authenticate token.' });
    }
};

export default authMiddleware;

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/user';
import { generateToken } from '../utils/tokenUtils';

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, location } = req.body;
        const join_date = Date.now();

        // Check if the user already exists
        const existingUser: IUser | null = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword: string = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser: IUser = new User({
            email,
            password: hashedPassword,
            name,
            location,
            join_date,
        });

        const savedUser: IUser = await newUser.save();

        // Generate a token with the user ID
        const token: string = generateToken({ userId: savedUser._id });

        res.status(201).json({ token, user: savedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to sign up' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user: IUser | null = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Compare the password
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        // Generate a token with the user ID
        const token: string = generateToken({ userId: user._id });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log in' });
    }
};


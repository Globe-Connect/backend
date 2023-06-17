import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/user';
import { generateToken } from '../utils/tokenUtils';
import sendEmail from '../utils/sendEmail';
import {IProfile, Profile} from "../models/profile";
import {uploadToFirebaseStorage} from "../utils/uploadFile";


interface CustomRequest extends Request {
    user?: {
        id: string;
    };
}

const generateOTP = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, address, state, country } = req.body;
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

        // Generate OTP
        const otp = generateOTP();

        // Create a new user
        const newUser: IUser = new User({
            email,
            password: hashedPassword,
            name,
            join_date,
            otp,
            address,
            state,
            country
        });

        await sendEmail({
            email,
            subject: 'Welcome to Globe Connect',
            message: `Hello ${name},\n\nWelcome to Globe Connect! We're thrilled to have you on board.\nTo get started, please verify your account by verifying your email using the following OTP (One-Time Password): ${otp}.\nThank you for choosing Globe Connect. If you have any questions or need assistance, our team is here to help.\n\nBest regards,\nThe Globe Connect Team`,
        });

        const savedUser: IUser = await newUser.save();

        // Generate a token with the user ID
        const token: string = generateToken({ userId: savedUser._id });

        // Schedule deletion of unverified accounts after 24 hours
        const deletionDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        scheduleAccountDeletion(savedUser._id, deletionDate);

        res.status(201).json({
            message: 'User registered successfully. Please check your email for OTP verification.',
        });
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

        // Check if the account is verified
        if (!user.verified) {
            res.status(401).json({ error: 'Account not verified' });
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

export const getUserById = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.params.userId; // Retrieve user ID from the request parameters

        const user: IUser | null = await User.findOne({ _id : userId });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};


export const generateOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user: IUser | null = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Generate OTP
        const otp = generateOTP();

        // Update user with the new OTP and OTP expiration time
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration
        await user.save();

        // Send OTP to the user's email
        await sendEmail({
            email,
            subject: 'OTP Verification',
            message: `Your OTP for account verification is ${otp}`,
        });

        res.json({ message: 'OTP generated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate OTP' });
    }
};

export const verifyAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        // Check if the user exists
        const user: IUser | null = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Check if the OTP is valid
        if (user.otp !== otp) {
            res.status(400).json({ error: 'Invalid OTP' });
            return;
        }

        // Check if the OTP is expired
        if (user.otpExpiry && user.otpExpiry < new Date()) {
            res.status(400).json({ error: 'OTP has expired' });
            return;
        }

        // Update user as verified
        user.verified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ message: 'Account verified successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify account' });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user: IUser | null = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Generate OTP
        const otp = generateOTP();

        // Update user with the new OTP and OTP expiration time
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration
        await user.save();

        // Send OTP to the user's email
        await sendEmail({
            email,
            subject: 'Forgot Password - OTP Verification',
            message: `Your OTP for password reset is ${otp}`,
        });

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;

        // Check if the user exists
        const user: IUser | null = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Check if the OTP is valid
        if (user.otp !== otp) {
            res.status(400).json({ error: 'Invalid OTP' });
            return;
        }

        // Check if the OTP is expired
        if (user.otpExpiry && user.otpExpiry < new Date()) {
            res.status(400).json({ error: 'OTP has expired' });
            return;
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword: string = await bcrypt.hash(newPassword, saltRounds);

        // Update user with the new password and reset OTP
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

// Schedule deletion of unverified accounts
const scheduleAccountDeletion = (userId: string, deletionDate: Date): void => {
    setTimeout(async () => {
        try {
            // Check if the user still exists and is not verified
            const user: IUser | null = await User.findOne({ _id: userId, verified: false });

            if (user) {
                // Delete the user
                await User.deleteOne({ _id: userId });
            }
        } catch (error) {
            console.error('Failed to delete unverified account:', error);
        }
    }, deletionDate.getTime() - Date.now());
};

export const uploadProfilePicture = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Retrieve the user ID from the authenticated user (assuming you have authentication middleware)

        // Get the uploaded file
        const file = req.file as Express.Multer.File;

        // Upload the file to Firebase Storage
        const fileURL = await uploadToFirebaseStorage(file);

        // Update the user with the profile picture URL
        const updatedUser: IUser | null = await User.findByIdAndUpdate(
            userId,
            { user_photo: fileURL },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ message: 'Profile picture uploaded successfully', user: updatedUser });
    } catch (error) {
        console.error('Failed to upload profile picture:', error);
        res.status(500).json({ error: 'Failed to upload profile picture' });
    }
};

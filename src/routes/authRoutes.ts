// authRoutes.ts
import express from 'express';
import {
    signUp,
    login,
    generateOtp,
    verifyAccount,
    forgotPassword,
    resetPassword,
    getUserById, uploadProfilePicture
} from '../controllers/authController';
import authMiddleware from "../middlewares/authMiddleware";
import multer from 'multer';
const router = express.Router();

const storage = multer.memoryStorage(); // Use memory storage for storing files temporarily

// Create multer upload instance
const upload = multer({ storage });

// Sign-up route
router.post('/signup', signUp);

// Sign-in route
router.post('/signin', login);

// Generate OTP route
router.post('/generate-otp', generateOtp);

// Verify account route
router.post('/verify-account', verifyAccount);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', resetPassword);

// Get user by ID route
router.get('/user/:userId', getUserById);

router.post(
    '/profile-picture',
    authMiddleware,
    upload.single('profilePicture'),
    uploadProfilePicture
);

export default router;

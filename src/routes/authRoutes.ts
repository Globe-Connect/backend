// authRoutes.ts
import express from 'express';
import { signUp, login } from '../controllers/authController';

const router = express.Router();

// Sign-up route
router.post('/signup', signUp);

// Sign-in route
router.post('/signin', login);


export default router;

import express from 'express';
import { connectToDatabase } from './database'; // Separate file for database connection
import dotenv from 'dotenv';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';

import authRouter from './routes/authRoutes';
import tagRouter from "./routes/tagRoutes";
import profileRouter from './routes/profileRoutes';
import connectionRouter from './routes/connectionRoutes';
import postRoutes from "./routes/postRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(helmet()); // Set various HTTP headers for security
app.use(
    rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
    })
);
app.use(mongoSanitize()); // Sanitize user input from NoSQL injection
app.use(hpp()); // Prevent parameter pollution
app.use(cors()); // Enable CORS

// Routes
app.get('/', (req, res) => {
    res.json({
        "msg":"Globe Connect Backend Server Up and Running"
    });
});

app.use('/auth', authRouter); // Add the auth routes
app.use('/tag', tagRouter); // Add the tag routes
app.use('/profile', profileRouter); // Add the profile routes
app.use('/connection', connectionRouter); // Add connection routes
app.use('/post', postRoutes); // Add the post routes

connectToDatabase()
    .then(() => {
        // Database connection successful, start the server
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
    });

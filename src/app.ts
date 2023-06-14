import express from 'express';
import { connectToDatabase } from './database'; // Separate file for database connection
import dotenv from 'dotenv';

import authRouter from './routes/authRoutes';
import tagRouter from "./routes/tagRoutes";
import profileRouter from './routes/profileRoutes';
import postRoutes from "./routes/postRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Routes
app.get('/', (req, res) => {
    res.json({
        "msg":"Globe Connect Backend Server Up and Running"
    });
});

app.use('/auth', authRouter); // Add the auth routes
app.use('/tag', tagRouter); //Add the tag routes
app.use('/profile', profileRouter); //Add the profile routes
app.use('/post', postRoutes); //Add the post routes

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

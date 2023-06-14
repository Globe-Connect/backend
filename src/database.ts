import mongoose from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        throw new Error('Failed to connect to MongoDB');
    }
};

import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    location: string;
    join_date: Date;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    join_date: { type: Date, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export {
    User,
    IUser
};

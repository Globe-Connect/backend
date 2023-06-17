import mongoose, { Schema, Document } from 'mongoose';
import { IProfile } from './profile';
import { IJob } from './job';

interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    address: string;
    state: string;
    country: string;
    join_date: Date;
    role: string;
    otp: number | undefined;
    otpExpiry: Date | undefined;
    verified: boolean;
    profile: IProfile['_id'];
    user_photo: string;
    created_jobs: IJob['_id'][];
    job_applications: IJob['_id'][];
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    join_date: { type: Date, required: true },
    role: { type: String, default: 'user' },
    otp: { type: Number },
    otpExpiry: { type: Date },
    verified: { type: Boolean, default: false },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
    user_photo: {
        type: String,
        default:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png',
    },
    created_jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    job_applications: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
});

const User = mongoose.model<IUser>('User', userSchema);

export { User, IUser };

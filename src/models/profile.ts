import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from "./user";

interface IConnectionRequest {
    user_id: IUser['_id'];
    status: 'pending' | 'accepted' | 'rejected';
}

interface IProfile extends Document {
    user_id: IUser['_id'];
    headline: string;
    summary: string;
    industry: string;
    website: string;
    tags: mongoose.Types.ObjectId[];
    connections: IConnectionRequest[];
}

const profileSchema = new Schema<IProfile>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    headline: { type: String },
    summary: { type: String },
    industry: { type: String },
    website: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    connections: [
        {
            user_id: { type: Schema.Types.ObjectId, ref: 'User' },
            status: { type: String, enum: ['pending', 'accepted', 'rejected'] }
        }
    ]
});

const Profile = mongoose.model<IProfile>('Profile', profileSchema);

export { Profile, IProfile };

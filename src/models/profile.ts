import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from "./user";

interface IProfile extends Document {
    user_id: IUser['_id'];
    headline: string;
    summary: string;
    industry: string;
    website: string;
    tags: string[]; // Array of tags
}

const profileSchema = new Schema<IProfile>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    headline: { type: String },
    summary: { type: String },
    industry: { type: String },
    website: { type: String },
    tags: [{ type: String }], // Array of tags
});

const Profile = mongoose.model<IProfile>('Profile', profileSchema);

export { Profile, IProfile };

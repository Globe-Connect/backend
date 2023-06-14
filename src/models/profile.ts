import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from "./user";
import { ITag } from "./tag";

interface IProfile extends Document {
    user_id: IUser['_id'];
    headline: string;
    summary: string;
    industry: string;
    website: string;
    tags: ITag['_id'][];
}

const profileSchema = new Schema<IProfile>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    headline: { type: String },
    summary: { type: String },
    industry: { type: String },
    website: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
});

const Profile = mongoose.model<IProfile>('Profile', profileSchema);

export { Profile, IProfile };

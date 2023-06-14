import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from "./user";
import { ITag } from "./tag";

interface IPost extends Document {
    user_id: IUser['_id'];
    content: string;
    image: string;
    post_date: Date;
    tags: ITag['_id'][];
    likes: IUser['_id'][];
    likes_count: number;
}

const postSchema = new Schema<IPost>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    image: { type: String },
    post_date: { type: Date, default: Date.now },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes_count: { type: Number, default: 0 },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
});

const Post = mongoose.model<IPost>('Post', postSchema);

export { Post, IPost };

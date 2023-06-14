import mongoose, { Schema, Document } from 'mongoose';

interface ITag extends Document {
    name: string;
    followed : number;
    posts: number;
}

const tagSchema = new Schema<ITag>({
    name: { type: String },
    followed: { type: Number },
    posts: { type: Number },// Array of tags
});

const Tag = mongoose.model<ITag>('Tag', tagSchema);

export { Tag, ITag };

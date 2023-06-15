import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

interface IExperience extends Document {
    user_id: IUser['_id'];
    company_name: string;
    title: string;
    location: string;
    start_date: Date;
    end_date: Date;
}

const experienceSchema = new Schema<IExperience>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company_name: { type: String, required: true },
    location: { type: String, required: true },
    title: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
});

const Experience = mongoose.model<IExperience>('Education', experienceSchema);

export { Experience, IExperience };

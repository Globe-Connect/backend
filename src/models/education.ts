import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

interface IEducation extends Document {
    user_id: IUser['_id'];
    school_name: string;
    degree: string;
    field_of_study: string;
    start_date: Date;
    end_date: Date;
}

const educationSchema = new Schema<IEducation>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    school_name: { type: String, required: true },
    degree: { type: String, required: true },
    field_of_study: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
});

const Education = mongoose.model<IEducation>('Education', educationSchema);

export { Education, IEducation };

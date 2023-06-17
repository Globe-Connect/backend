import mongoose, { Schema, Document } from 'mongoose';
import { IProfile } from './profile';
import { IUser } from './user';

enum JobType {
    Internship = 'internship',
    FullTime = 'full-time',
    PartTime = 'part-time',
}

interface IJob extends Document {
    job_id: number;
    company_name: string;
    compensation: number;
    position_title: string;
    location: string;
    description: string;
    posted_date: Date;
    type: JobType;
    creator: IUser['_id'];
    applicants: IUser['_id'][];
}

const jobSchema = new Schema<IJob>({
    job_id: { type: Number, required: true, unique: true },
    company_name: { type: String, required: true },
    compensation: { type: Number, required: true },
    position_title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    posted_date: { type: Date, required: true },
    type: { type: String, enum: Object.values(JobType), required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Job = mongoose.model<IJob>('Job', jobSchema);

export { Job, IJob, JobType };

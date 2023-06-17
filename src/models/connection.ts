import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

interface IConnection extends Document {
    fromUserId: IUser['_id'];
    toUserId: IUser['_id'];
    status: 'pending' | 'accepted' | 'rejected';
    level: number; // Indicates the connection level
}

const connectionSchema = new Schema<IConnection>({
    fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], required: true, default: 'pending' },
    level: { type: Number, required: true },
});


const Connection = mongoose.model<IConnection>('Connection', connectionSchema);
export { Connection, IConnection };

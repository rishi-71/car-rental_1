import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional if you later add Google/GitHub login
  role: 'customer' | 'vendor' | 'admin';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // 'select: false' prevents password from being returned in normal queries
  role: { 
    type: String, 
    enum: ['customer', 'vendor', 'admin'], 
    default: 'customer' 
  },
}, { timestamps: true });

// Prevent model overwrite upon initial compilation
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
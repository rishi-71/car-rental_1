import mongoose, { Schema, Document } from 'mongoose';

export interface ICar extends Document {
  vendorId: mongoose.Types.ObjectId; // Links back to the User (Vendor)
  make: string;
  carModel: string;
  year: number;
  pricePerDay: number;
  imageUrl: string;
  isAvailable: boolean;
  location: string;
}

const CarSchema: Schema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true },
  carModel: { type: String, required: true },
  year: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  location: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);
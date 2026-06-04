import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  carId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const BookingSchema: Schema = new Schema({
  carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'awaiting_payment','completed'], default: 'pending' },
  razonpayOrderId: {
    type: String,
    required: false,
  },
  razorpayPaymentId: {
    type: String,
    required: false,
  }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
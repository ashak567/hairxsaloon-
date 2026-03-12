import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  branch: string;
  branchId: string;
  gender: string;
  services: string[];        // array of service names
  stylistId: string;
  stylistName: string;
  date: string;              // ISO date string e.g. "2026-03-15"
  time: string;              // e.g. "10:00"
  durationMins: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  notes?: string;
  totalAmount?: number;
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  userId:        { type: Schema.Types.ObjectId, ref: 'User', required: false },
  customerName:  { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  branch:        { type: String, required: true },
  branchId:      { type: String, required: true },
  gender:        { type: String, required: true },
  services:      [{ type: String }],
  stylistId:     { type: String, required: true },
  stylistName:   { type: String, required: true },
  date:          { type: String, required: true },
  time:          { type: String, required: true },
  durationMins:  { type: Number, default: 30 },
  status:        { type: String, enum: ['Confirmed', 'Pending', 'Completed', 'Cancelled'], default: 'Confirmed' },
  notes:         { type: String },
  totalAmount:   { type: Number },
  createdAt:     { type: Date, default: Date.now },
});

export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  service: string;
  amount: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  appointmentId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  branch: string;
  items: IInvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
  status: 'Paid' | 'Unpaid';
  date: string;
  createdAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNumber:  { type: String, required: true, unique: true },
  appointmentId:  { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  customerName:   { type: String, required: true },
  customerEmail:  { type: String, required: true },
  branch:         { type: String, required: true },
  items:          [{ service: String, amount: Number }],
  subtotal:       { type: Number, required: true },
  cgst:           { type: Number, required: true },
  sgst:           { type: Number, required: true },
  total:          { type: Number, required: true },
  status:         { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  date:           { type: String, required: true },
  createdAt:      { type: Date, default: Date.now },
});

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

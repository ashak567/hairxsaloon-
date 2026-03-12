import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import Invoice from '@/lib/models/Invoice';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hair-x-studio-secret-2025';

const SERVICE_PRICES: Record<string, number> = {
  'Haircut': 300, 'Hair Trim': 200, 'Blow Dry': 400, 'Hair Coloring': 1500,
  'Balayage': 3500, 'Highlights': 2000, 'Keratin Treatment': 4000,
  'Hair Spa': 800, 'Hair Mask': 600, 'Dandruff Treatment': 700,
  'Beard Trim': 150, 'Beard Style': 250, 'Clean Shave': 200, 'Mustache Trim': 100,
  'Facial': 800, 'Cleanup': 500, 'Bleach': 400, 'Threading': 100,
  'Waxing (Half Leg)': 300, 'Waxing (Full Leg)': 500, 'Waxing (Arms)': 250,
  'Waxing (Full Body)': 1500, 'Manicure': 500, 'Pedicure': 600,
  'Bridal Makeup': 8000, 'Party Makeup': 3000, 'Saree Draping': 500,
  'Pre-Bridal Package': 10000, 'Mehndi (Bridal)': 3000,
  'Aromatherapy Massage': 2500, 'Head Massage': 400, 'Back Massage': 800,
};

function getUserId(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const decoded: any = jwt.verify(auth.slice(7), JWT_SECRET);
    return decoded.userId;
  } catch { return null; }
}

// GET /api/appointments — user sees their own; admin sees all (with ?all=1)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');
    const userId = getUserId(req);

    let query: any = {};
    if (!all) {
      if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      query.userId = userId;
    }

    const appointments = await Appointment.find(query).sort({ date: -1, time: -1 });
    return NextResponse.json({ appointments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/appointments — create a new booking
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const userId = getUserId(req);

    const { customerName, customerEmail, customerPhone, branch, branchId, gender,
            services, stylistId, stylistName, date, time, durationMins } = body;

    if (!customerName || !customerEmail || !services?.length || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate total from service prices
    const totalAmount = (services as string[]).reduce((sum, s) => sum + (SERVICE_PRICES[s] || 0), 0);

    const appointment = await Appointment.create({
      userId: userId || undefined,
      customerName, customerEmail, customerPhone,
      branch, branchId, gender,
      services, stylistId, stylistName,
      date, time, durationMins: durationMins || 30,
      status: 'Confirmed',
      totalAmount,
    });

    // Auto-generate invoice
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${date.replace(/-/g, '')}-${String(count + 1).padStart(3, '0')}`;
    const items = (services as string[]).map((s) => ({ service: s, amount: SERVICE_PRICES[s] || 0 }));
    const subtotal = totalAmount;
    const cgst = Math.round(subtotal * 0.09);
    const sgst = Math.round(subtotal * 0.09);
    const total = subtotal + cgst + sgst;

    await Invoice.create({
      invoiceNumber, appointmentId: appointment._id,
      customerName, customerEmail, branch: branch || 'Parvatinagar Branch',
      items, subtotal, cgst, sgst, total, status: 'Unpaid',
      date: new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

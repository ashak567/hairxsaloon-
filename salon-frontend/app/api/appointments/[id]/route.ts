import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hair-x-studio-secret-2025';

function getUserId(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const decoded: any = jwt.verify(auth.slice(7), JWT_SECRET);
    return decoded.userId;
  } catch { return null; }
}

// PATCH /api/appointments/[id] — update status (admin) or reschedule/cancel (user)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const userId = getUserId(req);
    const body = await req.json();
    const { status, date, time } = body;

    const { id } = await params;
    const appointment = await Appointment.findById(id);
    if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Allow update if admin (no userId check) or owner
    if (userId && appointment.userId && appointment.userId.toString() !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (status) appointment.status = status;
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    await appointment.save();

    return NextResponse.json({ appointment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/appointments/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const appointment = await Appointment.findById(id);
    if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ appointment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

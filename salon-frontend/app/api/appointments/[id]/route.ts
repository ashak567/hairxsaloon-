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

// DELETE /api/appointments/[id] — delete an appointment (admin)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    jwt.verify(auth.slice(7), JWT_SECRET); // Will throw if invalid admin token

    await connectToDatabase();
    const { id } = await params;
    
    // Ensure the ID is valid
    if (!id || id.length < 24) {
        return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 });
    }

    const result = await Appointment.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

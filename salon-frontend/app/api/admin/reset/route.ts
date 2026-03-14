import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import Invoice from '@/lib/models/Invoice';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hair-x-studio-secret-2025';

// Authenticate helper
function getAdminId(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const decoded: any = jwt.verify(auth.slice(7), JWT_SECRET);
    return decoded.role === 'admin' ? decoded.adminId : null;
  } catch { return null; }
}

export async function DELETE(req: NextRequest) {
  try {
    const adminId = getAdminId(req);
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Using searchParams or body: let's use search params
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type === 'appointments') {
      await Appointment.deleteMany({});
      return NextResponse.json({ success: true, message: 'All appointments have been deleted' });
    }
    
    if (type === 'invoices') {
      await Invoice.deleteMany({});
      return NextResponse.json({ success: true, message: 'All invoices have been deleted (Revenue Reset)' });
    }

    return NextResponse.json({ error: 'Invalid reset type specified' }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Invoice from '@/lib/models/Invoice';

// GET /api/invoices — all invoices (admin)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get('appointmentId');
    const query: any = appointmentId ? { appointmentId } : {};
    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ invoices });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

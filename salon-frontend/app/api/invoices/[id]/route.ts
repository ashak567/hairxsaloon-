import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Invoice from '@/lib/models/Invoice';

// PATCH /api/invoices/[id] — mark as Paid/Unpaid
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const invoice = await Invoice.findByIdAndUpdate(id, { status }, { new: true });
    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ invoice });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

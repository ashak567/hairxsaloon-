import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/lib/models/Admin';
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

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const adminId = getAdminId(req);
    
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newUsername, newPassword } = await req.json();
    const admin = await Admin.findById(adminId);
    
    if (!admin) {
        return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    if (newUsername) admin.username = newUsername;
    if (newPassword && newPassword.trim().length > 0) admin.password = newPassword;
    
    await admin.save();

    return NextResponse.json({ success: true, message: 'Settings updated successfully', username: admin.username });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

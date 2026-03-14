import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/lib/models/Admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hair-x-studio-secret-2025';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const adminCount = await Admin.countDocuments();
    let admin = null;

    // First time setup - auto create admin if none exists
    if (adminCount === 0) {
      admin = await Admin.create({ username, password });
    } else {
      admin = await Admin.findOne({ username });
      if (!admin) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }

      const valid = await admin.comparePassword(password);
      if (!valid) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }
    }

    const token = jwt.sign({ adminId: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({ token, username: admin.username });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

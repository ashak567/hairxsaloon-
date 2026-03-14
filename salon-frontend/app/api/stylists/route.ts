import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');

    // Currently mocked for simplicity, but could easily pull from a MongoDB Stylist schema 
    // or aggregate from appointments in the future.
    let stylists = [
      { _id: 's1', name: 'Arun Kumar', specialization: 'Master Stylist', rating: 4.9, branch: '1' },
      { _id: 's2', name: 'Priya Sharma', specialization: 'Senior Colorist', rating: 4.8, branch: '1' },
      { _id: 's3', name: 'Ravi Naik', specialization: 'Creative Director', rating: 4.9, branch: '1' },
      { _id: 's4', name: 'Divya Reddy', specialization: 'Senior Stylist', rating: 4.7, branch: '2' },
      { _id: 's5', name: 'Meera Patil', specialization: 'Hair Extension Specialist', rating: 4.9, branch: '2' },
      { _id: 's6', name: 'Suresh D.', specialization: 'Master Stylist', rating: 4.8, branch: '2' },
    ];

    if (branchId) {
        stylists = stylists.filter(s => s.branch === branchId);
    }

    return NextResponse.json({ stylists });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

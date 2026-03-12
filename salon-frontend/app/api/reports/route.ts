import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import Invoice from '@/lib/models/Invoice';

// GET /api/reports — compute real stats from DB
export async function GET(_req: NextRequest) {
  try {
    await connectToDatabase();

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Today's appointments
    const todayAppts = await Appointment.find({ date: today, status: { $ne: 'Cancelled' } });
    const yesterdayAppts = await Appointment.find({ date: yesterday, status: { $ne: 'Cancelled' } });

    // Revenue from paid invoices today
    const todayInvoices = await Invoice.find({
      date: today, status: 'Paid',
    });
    const yesterdayInvoices = await Invoice.find({
      date: yesterday, status: 'Paid',
    });

    const todayRevenue = todayInvoices.reduce((s, inv) => s + inv.total, 0);
    const yesterdayRevenue = yesterdayInvoices.reduce((s, inv) => s + inv.total, 0);

    // Most popular services (all time)
    const allAppts = await Appointment.find({ status: { $ne: 'Cancelled' } });
    const serviceCount: Record<string, { count: number; revenue: number }> = {};
    allAppts.forEach((appt) => {
      appt.services.forEach((svc) => {
        if (!serviceCount[svc]) serviceCount[svc] = { count: 0, revenue: 0 };
        serviceCount[svc].count++;
      });
    });

    // Match revenue from invoices
    const allPaidInvoices = await Invoice.find({ status: 'Paid' });
    allPaidInvoices.forEach((inv) => {
      inv.items.forEach((item) => {
        if (serviceCount[item.service]) {
          serviceCount[item.service].revenue += item.amount;
        }
      });
    });

    const popularServices = Object.entries(serviceCount)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));

    // Stylist breakdown (all time confirmed/completed)
    const stylistCount: Record<string, number> = {};
    allAppts.forEach((appt) => {
      if (!stylistCount[appt.stylistName]) stylistCount[appt.stylistName] = 0;
      stylistCount[appt.stylistName]++;
    });
    const topStylists = Object.entries(stylistCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, clients]) => ({ name, clients }));

    // Total stats
    const totalBookings = await Appointment.countDocuments({ status: { $ne: 'Cancelled' } });
    const totalRevenue = (await Invoice.find({ status: 'Paid' })).reduce((s, inv) => s + inv.total, 0);

    return NextResponse.json({
      today: {
        revenue: todayRevenue,
        appointments: todayAppts.length,
        revenueChange: yesterdayRevenue > 0 ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100) : 0,
        appointmentsChange: todayAppts.length - yesterdayAppts.length,
      },
      totalRevenue,
      totalBookings,
      popularServices,
      topStylists,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

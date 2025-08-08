import { headers } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import { parse } from 'cookie';
import AdminDashboard from '@/components/admin/AdminDashboard';


export default async function AdminPage() {
  const headerList = await headers();
  const rawCookie = headerList.get('cookie') || '';
  const cookies = parse(rawCookie);
  const token = cookies.admin_token;

  if (!token) {
    redirect('/admin/login');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== 'admin') {
      redirect('/admin/login');
    }

    return <AdminDashboard />; // نمایش پنل ادمین واقعی
  } catch (err) {
    console.error('❌ JWT verify failed:', err);
    redirect('/admin/login');
  }
}

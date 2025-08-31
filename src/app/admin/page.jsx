'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminRoot() {
  const [ok, setOk] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/auth-check', { credentials: 'include' })
      .then(r => {
        if (r.ok) return setOk(true);
        throw new Error('unauth');
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  if (ok === null) return <div className="p-6">در حال بررسی دسترسی...</div>;

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}

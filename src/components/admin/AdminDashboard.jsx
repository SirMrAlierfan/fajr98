'use client';

import { useState } from 'react';
import GeneralAdminPanel from './AdminPanel';
import MajorsAdminPanel from './majors';

export default function AdminDashboard() {
  const [mode, setMode] = useState('general');

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">پنل مدیریت</h1>

      {/* سوییچر نوع پنل */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setMode('general')}
          className={`py-2 px-4 rounded ${mode === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          صفحات عمومی
        </button>
        <button
          onClick={() => setMode('interduction')}
          className={`py-2 px-4 rounded ${mode === 'interduction' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          معرفی رشته‌ها
        </button>
      </div>

      {/* نمایش پنل مناسب */}
      {mode === 'general' && <GeneralAdminPanel />}
      {mode === 'interduction' && <MajorsAdminPanel />}
    </div>
  );
}

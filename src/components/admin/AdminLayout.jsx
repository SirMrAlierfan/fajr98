import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="bg-white shadow p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">پنل مدیریت</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}

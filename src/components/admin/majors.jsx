'use client';

import { useState } from 'react';

export default function MajorsAdminPanel() {
  const [form, setForm] = useState({
    slug: '',
    title: '',
    content: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/interduction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ با موفقیت ذخیره شد!');
        setForm({ slug: '', title: '', content: '', image: '' });
      } else {
        alert(`❌ خطا: ${result.error}`);
      }
    } catch (err) {
      alert('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">مدیریت معرفی رشته‌ها</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="slug (مثلاً: math)"
          value={form.slug}
          onChange={(e) => handleChange('slug', e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="عنوان"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="محتوا"
          value={form.content}
          onChange={(e) => handleChange('content', e.target.value)}
          className="w-full p-2 border rounded min-h-[100px]"
          required
        />
        <input
          type="text"
          placeholder="لینک عکس (اختیاری)"
          value={form.image}
          onChange={(e) => handleChange('image', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? 'در حال ذخیره...' : 'ذخیره'}
        </button>
      </form>
    </div>
  );
}


'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/adminApi';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await login(password);
      router.push('/admin');
    } catch (e) {
      setErr(e.message || 'خطا در ورود');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">ورود ادمین</h2>
      <form onSubmit={handle}>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
          placeholder="رمز ادمین" className="w-full p-2 border rounded mb-3" />
        {err && <div className="text-red-500 mb-2">{err}</div>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">ورود</button>
      </form>
    </div>
  );
}

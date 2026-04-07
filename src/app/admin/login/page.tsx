'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/admin-api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      router.push('/admin');
    } catch {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-8">Admin Login</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-200 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900" />
          <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-2 hover:bg-gray-700 disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

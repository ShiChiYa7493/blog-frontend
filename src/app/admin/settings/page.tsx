'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProfile, updateProfile, uploadImage } from '@/lib/admin-api';

export default function AdminSettingsPage() {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProfile().then((p: Record<string, unknown>) => {
      setNickname(p.nickname as string);
      setAvatar((p.avatar as string) || '');
    });
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadImage(file);
    setAvatar(result.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Record<string, unknown> = { nickname };
    if (avatar) data.avatar = avatar;
    if (password) data.password = password;
    await updateProfile(data);
    setPassword('');
    setMessage('Settings saved');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white border p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Avatar</label>
          {avatar && <Image src={avatar} alt="avatar" width={64} height={64} className="w-16 h-16 rounded-full mb-2" />}
          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm" />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Nickname</label>
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">New Password (leave blank to keep current)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2" />
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" className="bg-gray-900 text-white px-6 py-2 text-sm">Save</button>
          {message && <span className="text-sm text-green-600">{message}</span>}
        </div>
      </form>
    </div>
  );
}

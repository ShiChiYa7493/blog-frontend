'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { getProfile, updateProfile, uploadImage } from '@/lib/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');

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
    toast.success('Avatar uploaded');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Record<string, unknown> = { nickname };
    if (avatar) data.avatar = avatar;
    if (password) data.password = password;
    await updateProfile(data);
    setPassword('');
    toast.success('Settings saved');
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Avatar</Label>
              {avatar && (
                <Image src={avatar} alt="avatar" width={64} height={64} className="w-16 h-16 rounded-full mb-2" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="text-sm text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <p className="text-xs text-muted-foreground">Leave blank to keep current password</p>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

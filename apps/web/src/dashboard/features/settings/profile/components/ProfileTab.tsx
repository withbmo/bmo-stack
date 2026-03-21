'use client';

import { toast } from '@/ui/system';
import { Upload, User, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { DashboardPageHeader } from '@/dashboard/components/layout';
import { useAuth } from '@/shared/auth';
import { resolveAvatarUrl } from '@/shared/lib/avatar';
import {
  deleteAvatar,
  updateCurrentUser,
  uploadAvatar,
  type User as CurrentUser,
} from '@/shared/lib/user';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Input } from '@/ui/shadcn/ui/input';
import { Label } from '@/ui/shadcn/ui/label';
import { Textarea } from '@/ui/shadcn/ui/textarea';

export const ProfileTab = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const { user, hydrated, refreshSession } = useAuth();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');

  const avatarUrl = useMemo(() => resolveAvatarUrl(profile?.avatarUrl), [profile?.avatarUrl]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const data = await refreshSession();
        if (cancelled || !data) return;
        setProfile(data);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setBio(data.bio || '');
      } catch {
        if (!cancelled) toast.error('Failed to load profile.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, refreshSession]);

  const handleSave = async () => {
    if (!hydrated || !user || !profile) return;
    setIsSaving(true);
    try {
      const updated = await updateCurrentUser(undefined, {
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        bio: bio.trim() || null,
      });
      setProfile(updated);
      await refreshSession();
      toast.success('Profile updated.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!hydrated || !user || !event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';
    setIsSaving(true);
    try {
      const updated = await uploadAvatar(undefined, file);
      setProfile(updated);
      await refreshSession();
      toast.success('Avatar updated.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload avatar.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!hydrated || !user || !avatarUrl) return;
    setIsSaving(true);
    try {
      const updated = await deleteAvatar(undefined);
      setProfile(updated);
      await refreshSession();
      toast.success('Avatar removed.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove avatar.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {!hideHeader ? (
        <DashboardPageHeader
          badge={{ icon: User, label: 'Profile' }}
          title="Profile settings"
          subtitle="Manage your public identity."
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className="relative flex size-20 cursor-pointer items-center justify-center overflow-hidden rounded-md border bg-muted"
            onClick={() => fileRef.current?.click()}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={80}
                height={80}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <User size={24} className="text-muted-foreground" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Recommended: 400×400px, JPG or PNG, max 2MB.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={isSaving || isLoading}>
                <Upload size={14} />
                Upload
              </Button>
              <Button type="button" variant="outline" onClick={handleRemoveAvatar} disabled={isSaving || !avatarUrl}>
                <X size={14} />
                Remove
              </Button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={profile?.username || ''} readOnly disabled />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                type="text"
                value={firstName}
                onChange={event => setFirstName(event.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                type="text"
                value={lastName}
                onChange={event => setLastName(event.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={profile?.email || ''} readOnly disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={event => setBio(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving || isLoading || !profile}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

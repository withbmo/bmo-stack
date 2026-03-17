import { User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  Button,
  DashboardPageHeader,
  DynamicSkeletonProvider,
  DynamicSlot,
  Input,
  Skeleton,
} from '@/dashboard/components';
import { useAuth } from '@/shared/auth';
import { resolveAvatarUrl } from '@/shared/lib/avatar';
import {
  deleteAvatar,
  updateCurrentUser,
  uploadAvatar,
  type User as CurrentUser,
} from '@/shared/lib/user';

export const ProfileTab = () => {
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
        if (cancelled) return;
        if (!data) return;
        setProfile(data);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setBio(data.bio || '');
      } catch {
        if (!cancelled) toast.error('Failed to load profile');
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
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadClick = () => fileRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hydrated || !user || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    setIsSaving(true);
    try {
      const updated = await uploadAvatar(undefined, file);
      setProfile(updated);
      await refreshSession();
      toast.success('Avatar updated');
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to upload avatar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!hydrated || !user) return;
    setIsSaving(true);
    try {
      const updated = await deleteAvatar(undefined);
      setProfile(updated);
      await refreshSession();
      toast.success('Avatar removed');
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to remove avatar');
    } finally {
      setIsSaving(false);
    }
  };

  const initialLoading = isLoading && !profile;

  return (
    <DynamicSkeletonProvider loading={initialLoading}>
    <div className="space-y-6">
      <DashboardPageHeader
        badge={{ icon: User, label: 'PROFILE' }}
        title="PROFILE SETTINGS"
        subtitle="Manage your public identity"
        variant="minimal"
        className="mb-2 border-0 pb-2"
      />

      {/* Avatar */}
      <div className="border border-border-default bg-bg-panel">
        <div className="px-6 py-4 border-b border-border-default">
          <p className="font-mono text-[10px] text-text-primary/80 uppercase tracking-widest">Avatar</p>
        </div>
        <div className="px-6 py-5 flex items-start gap-6">
          <DynamicSlot
            skeleton={<Skeleton className="w-20 h-20 shrink-0" />}
          >
            <div
              className="w-20 h-20 bg-bg-surface border border-border-default flex items-center justify-center text-text-primary/75 relative group cursor-pointer overflow-hidden shrink-0"
              onClick={handleUploadClick}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <User size={24} className="group-hover:scale-110 transition-transform" />
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-mono text-white text-center uppercase tracking-widest">
                  Upload
                </span>
              </div>
            </div>
          </DynamicSlot>
          <div className="flex-1">
            <p className="font-mono text-xs text-text-primary/75 leading-relaxed mb-4">
              Recommended: 400×400px. Supported: JPG, PNG. Max 2MB.
            </p>
            <DynamicSlot
              skeleton={<Skeleton className="h-9 w-28" />}
            >
              <Button
                onClick={handleRemoveAvatar}
                disabled={isSaving || !avatarUrl}
                variant="secondary"
                size="sm"
                className="text-xs tracking-wider"
              >
                Remove Avatar
              </Button>
            </DynamicSlot>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="border border-border-default bg-bg-panel">
        <div className="px-6 py-4 border-b border-border-default">
          <p className="font-mono text-[10px] text-text-primary/80 uppercase tracking-widest">Identity</p>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 gap-5">
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-text-primary/80 uppercase tracking-wider">
              Username
            </label>
            <DynamicSlot skeleton={<Skeleton className="h-10 w-full" />}>
              <Input
                type="text"
                value={profile?.username || ''}
                readOnly
                disabled
                variant="default"
                size="sm"
              />
            </DynamicSlot>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-text-primary/80 uppercase tracking-wider">
                First Name
              </label>
              <DynamicSlot skeleton={<Skeleton className="h-10 w-full" />}>
                <Input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  disabled={isLoading}
                  variant="default"
                  intent="brand"
                  size="sm"
                />
              </DynamicSlot>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-text-primary/80 uppercase tracking-wider">
                Last Name
              </label>
              <DynamicSlot skeleton={<Skeleton className="h-10 w-full" />}>
                <Input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  disabled={isLoading}
                  variant="default"
                  intent="brand"
                  size="sm"
                />
              </DynamicSlot>
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-text-primary/80 uppercase tracking-wider">
              Email Address
            </label>
            <DynamicSlot skeleton={<Skeleton className="h-10 w-full" />}>
              <Input
                type="email"
                value={profile?.email || ''}
                disabled
                readOnly
                variant="default"
                size="sm"
              />
            </DynamicSlot>
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-text-primary/80 uppercase tracking-wider">
              Bio / Status
            </label>
            <DynamicSlot skeleton={<Skeleton className="h-20 w-full" />}>
              <Input
                multiline
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                disabled={isLoading}
                variant="default"
                intent="brand"
                size="sm"
              />
            </DynamicSlot>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading || !profile}
          variant="primary"
          size="sm"
          className="px-8 text-xs tracking-wider"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
    </DynamicSkeletonProvider>
  );
};

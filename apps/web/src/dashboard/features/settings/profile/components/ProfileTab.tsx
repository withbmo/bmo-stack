import { User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { DashboardPageHeader, Input, ProfileSkeleton } from '@/dashboard/components';
import { useAuth } from '@/shared/auth';
import { resolveAvatarUrl } from '@/shared/lib/avatar';
import {
  deleteAvatar,
  updateCurrentUser,
  uploadAvatar,
  type UserProfile,
} from '@/shared/lib/user';

export const ProfileTab = () => {
  const { user, hydrated, refreshSession } = useAuth();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  if (isLoading && !profile) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <DashboardPageHeader
        badge={{ icon: User, label: 'PROFILE' }}
        title="PROFILE SETTINGS"
        subtitle="Manage your public identity"
        variant="minimal"
        className="mb-0 border-0 pb-0"
      />

      <div className="flex items-start gap-6 pb-8 border-b border-nexus-gray/30">
        <div
          className="w-32 h-32 bg-nexus-gray/10 border border-nexus-gray flex items-center justify-center text-nexus-purple relative group cursor-pointer overflow-hidden"
          onClick={handleUploadClick}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={128}
              height={128}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <User size={32} className="group-hover:scale-110 transition-transform" />
          )}
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-mono text-white text-center">
              UPLOAD
              <br />
              IMAGE
            </span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-white font-bold mb-2">Avatar</h4>
          <p className="text-xs text-nexus-muted mb-4 font-mono leading-relaxed">
            Recommended dimensions: 400x400px.
            <br />
            Supported formats: JPG, PNG. Max 2MB.
          </p>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleRemoveAvatar}
              disabled={isSaving || !avatarUrl}
              className="px-4 py-2 border border-nexus-gray text-nexus-muted font-mono text-xs font-bold hover:text-white hover:border-white transition-colors disabled:opacity-60"
            >
              REMOVE
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-nexus-purple uppercase tracking-wider">
            Username
          </label>
          <Input type="text" value={profile?.username || ''} readOnly disabled />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-nexus-purple uppercase tracking-wider">
            First Name
          </label>
          <Input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-nexus-purple uppercase tracking-wider">
            Last Name
          </label>
          <Input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-nexus-purple uppercase tracking-wider">
            Email Address
          </label>
          <Input
            type="email"
            value={profile?.email || ''}
            disabled
            readOnly
          />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-nexus-purple uppercase tracking-wider">
            Bio / Status
          </label>
          <Input
            multiline
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading || !profile}
          className="px-8 py-3 bg-nexus-purple text-white font-mono font-bold text-xs hover:bg-nexus-neon transition-colors shadow-lg shadow-purple-900/20 disabled:opacity-60"
        >
          {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>
    </div>
  );
};

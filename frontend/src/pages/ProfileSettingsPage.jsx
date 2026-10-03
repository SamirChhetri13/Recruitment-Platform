import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, changeUserPassword } from '../api/auth.api';
import { User, Lock, Save, KeyRound, CheckCircle2, AlertCircle, Camera, Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Input, Button, Avatar, Badge } from '../components/ui';

export const ProfileSettingsPage = () => {
  const { user, updateUser } = useAuth();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Calculate profile completeness score
  const completenessItems = [
    Boolean(user?.name),
    Boolean(user?.email),
    Boolean(user?.avatar),
    Boolean(user?.role),
  ];
  const completedCount = completenessItems.filter(Boolean).length;
  const completenessPercent = Math.round((completedCount / completenessItems.length) * 100);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      setProfileError('');
      setProfileSuccess('');

      const res = await updateUserProfile({ name, avatar });
      if (res.success) {
        updateUser({ name, avatar });
        setProfileSuccess('Profile updated successfully!');
        toast.success('Profile updated!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile';
      setProfileError(msg);
      toast.error(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');

      const res = await changeUserPassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        toast.success('Password changed!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to change password';
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white font-display">
          Account Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1">
          Manage your personal information, avatar photo, CV documents, and security credentials.
        </p>
      </div>

      {/* Profile Completeness Progress Bar */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-hired" />
            <span className="text-xs font-bold text-ink-900 dark:text-white font-display">
              Profile Completeness
            </span>
          </div>
          <span className="text-xs font-extrabold text-brand-600 dark:text-brand-300">
            {completenessPercent}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
          <div
            className="h-full bg-brand-gradient transition-all duration-300"
            style={{ width: `${completenessPercent}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Details Card */}
        <Card className="space-y-6">
          <div className="flex items-center gap-3 border-b border-ink-100 dark:border-ink-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink-900 dark:text-white font-display">Profile Information</h3>
              <p className="text-2xs text-ink-500 dark:text-ink-400">Update your name and profile photo URL</p>
            </div>
          </div>

          {/* Avatar & User Info */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800">
            <Avatar name={name || user?.name} src={avatar} size="lg" />
            <div className="overflow-hidden flex-1">
              <h4 className="text-sm font-bold text-ink-900 dark:text-white truncate">{name || user?.name}</h4>
              <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{user?.email}</p>
              <Badge variant="brand" size="sm" className="mt-1 capitalize">
                {user?.role} Account
              </Badge>
            </div>
          </div>

          {profileError && (
            <div className="p-3 rounded-xl bg-status-rejected/10 border border-status-rejected/20 text-status-rejected text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {profileSuccess && (
            <div className="p-3 rounded-xl bg-status-hired/10 border border-status-hired/20 text-status-hired text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              leftIcon={User}
            />

            <Input
              label="Avatar Image URL"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              leftIcon={Camera}
            />

            <Input
              label="Email Address (Read Only)"
              type="email"
              value={user?.email || ''}
              disabled
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={profileLoading}
              className="w-full"
              leftIcon={Save}
            >
              Save Profile Changes
            </Button>
          </form>

          {/* CV / Resume Upload Box Placeholder */}
          <div className="pt-4 border-t border-ink-100 dark:border-ink-800 space-y-2">
            <label className="text-2xs font-semibold text-ink-700 dark:text-ink-300 tracking-wide uppercase">
              Curriculum Vitae (CV / Resume)
            </label>
            <div
              onClick={() => alert("CV drag-and-drop placeholder: You can upload your PDF resume when applying for jobs.")}
              className="p-6 rounded-2xl border-2 border-dashed border-ink-200 dark:border-ink-800 text-center cursor-pointer hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 transition-colors space-y-2"
            >
              <Upload className="w-6 h-6 text-brand-600 dark:text-brand-300 mx-auto" />
              <p className="text-xs font-bold text-ink-900 dark:text-white">Drag & Drop your CV here</p>
              <p className="text-2xs text-ink-400">PDF or DOCX format (Max 10MB)</p>
            </div>
          </div>
        </Card>

        {/* Change Security Password Card */}
        <Card className="space-y-6">
          <div className="flex items-center gap-3 border-b border-ink-100 dark:border-ink-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-sun-50 dark:bg-sun-950 text-sun-600 dark:text-sun-300 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink-900 dark:text-white font-display">Security & Credentials</h3>
              <p className="text-2xs text-ink-500 dark:text-ink-400">Update your security password</p>
            </div>
          </div>

          {passwordError && (
            <div className="p-3 rounded-xl bg-status-rejected/10 border border-status-rejected/20 text-status-rejected text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-status-hired/10 border border-status-hired/20 text-status-hired text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              required
              isPasswordToggleable
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              leftIcon={Lock}
            />

            <Input
              label="New Password"
              type="password"
              required
              isPasswordToggleable
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              leftIcon={Lock}
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              isPasswordToggleable
              minLength={6}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Repeat new password"
              leftIcon={Lock}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={passwordLoading}
              className="w-full"
            >
              Update Security Password
            </Button>
          </form>
        </Card>

      </div>
    </div>
  );
};

export default ProfileSettingsPage;

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAmalanStore } from '../store/amalanStore';
import { useWaterStore } from '../store/waterStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useWalletStore } from '../store/walletStore';
import ProgressBar from '../components/common/ProgressBar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import { 
  UserIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { validateBio } from '../utils/validation';
import { formatDate } from '../utils/dateUtils';

const Profile: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAuthStore();
  const getAmalanStats = useAmalanStore((state) => state.getAmalanStats);
  const getWaterStats = useWaterStore((state) => state.getWaterStats);
  const getWorkoutStats = useWorkoutStore((state) => state.getWorkoutStats);
  const getWalletStats = useWalletStore((state) => state.getWalletStats);
  
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ bio?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const amalanStats = getAmalanStats(currentUser.id);
  const waterStats = getWaterStats(currentUser.id);
  const workoutStats = getWorkoutStats(currentUser.id);
  const walletStats = getWalletStats(currentUser.id);

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Ukuran file maksimal 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        updateProfile({ avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    const bioError = validateBio(bio);
    if (bioError) {
      setErrors({ bio: bioError });
      return;
    }

    updateProfile({ bio });
    setIsEditing(false);
    setErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRemoveAvatar = () => {
    updateProfile({ avatar: undefined });
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Bergabung {formatDate(currentUser.createdAt)}
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                onClick={handleAvatarClick}
                className={`w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center border-4 ${
                  isEditing 
                    ? 'border-emerald-400 cursor-pointer hover:border-emerald-500' 
                    : 'border-white'
                }`}
              >
                {currentUser.avatar || avatarPreview ? (
                  <img
                    src={avatarPreview || currentUser.avatar}
                    alt={currentUser.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-16 h-16 text-emerald-600" />
                )}
                {isEditing && (
                  <div className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full">
                    <PencilIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              {isEditing && (currentUser.avatar || avatarPreview) && (
                <button
                  onClick={handleRemoveAvatar}
                  className="absolute top-0 right-0 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            {isEditing && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Klik foto untuk mengubah
              </p>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  @{currentUser.username}
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    Bergabung {formatDate(currentUser.createdAt)}
                  </span>
                </div>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  icon={<PencilIcon className="w-4 h-4" />}
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    variant="primary"
                  >
                    Simpan
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setBio(currentUser.bio || '');
                      setAvatarPreview(null);
                      setErrors({});
                    }}
                    variant="ghost"
                  >
                    Batal
                  </Button>
                </div>
              )}
            </div>

            {/* Bio Section */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Bio
              </label>
              {isEditing ? (
                <div>
                  <textarea
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                      if (errors.bio) setErrors({});
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px] ${
                      errors.bio ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ceritakan sedikit tentang diri Anda..."
                    maxLength={200}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500 text-right">
                    {bio.length}/200 karakter
                  </p>
                </div>
              ) : (
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {currentUser.bio || 'Belum ada bio...'}
                </p>
              )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-emerald-800 mb-1">Amalan</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {amalanStats.totalCompleted}
                </p>
                <p className="text-xs text-emerald-700">
                  {amalanStats.streak} hari streak
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-1">Air</p>
                <p className="text-2xl font-bold text-blue-900">
                  {waterStats.dailyAverage}
                </p>
                <p className="text-xs text-blue-700">
                  gelas/hari
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-800 mb-1">Olahraga</p>
                <p className="text-2xl font-bold text-amber-900">
                  {workoutStats.totalWorkouts}
                </p>
                <p className="text-xs text-amber-700">
                  {workoutStats.streak} hari streak
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-800 mb-1">Tabungan</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.round(walletStats.progressToTarget)}%
                </p>
                <p className="text-xs text-purple-700">
                  dari target
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* History Navigation */}
      <Card title="Riwayat Aktivitas">
        <p className="text-gray-600 mb-4">Lihat dan analisis aktivitas Anda</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/history/amalan"
            className="block p-4 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                <ChartBarIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Riwayat Amalan</h4>
                <p className="text-sm text-gray-600">Analisis amalan harian</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/history/water"
            className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <ChartBarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Riwayat Air</h4>
                <p className="text-sm text-gray-600">Lacak konsumsi air</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/history/workout"
            className="block p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <ChartBarIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Riwayat Olahraga</h4>
                <p className="text-sm text-gray-600">Perkembangan olahraga</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/history/tabungan"
            className="block p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <ChartBarIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Riwayat Tabungan</h4>
                <p className="text-sm text-gray-600">Laporan keuangan</p>
              </div>
            </div>
          </Link>
        </div>
      </Card>

      {/* Progress Overview */}
      <Card title="Progress Overview">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 font-medium">Amalan Sunnah</span>
              <span className="font-bold text-emerald-700">
                {amalanStats.dailyAverage}/hari
              </span>
            </div>
            <ProgressBar progress={(amalanStats.dailyAverage / 6) * 100} />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 font-medium">Air Putih</span>
              <span className="font-bold text-blue-700">
                {waterStats.dailyAverage}/8 gelas
              </span>
            </div>
            <ProgressBar progress={(waterStats.dailyAverage / 8) * 100} color="blue" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 font-medium">Olahraga</span>
              <span className="font-bold text-amber-700">
                {workoutStats.completionRate}% completion
              </span>
            </div>
            <ProgressBar progress={workoutStats.completionRate} color="amber" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 font-medium">Tabungan</span>
              <span className="font-bold text-purple-700">
                {Math.round(walletStats.progressToTarget)}% dari target
              </span>
            </div>
            <ProgressBar progress={walletStats.progressToTarget} color="purple" />
          </div>
        </div>
      </Card>

      {/* Logout Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleLogout}
          variant="ghost"
          icon={<ArrowRightOnRectangleIcon className="w-5 h-5" />}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
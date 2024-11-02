import React, { useState } from 'react';
import { 
  User, Settings, Trophy, Shield, 
  Medal, Clock, Edit, Camera,
  Bell, Lock, LogOut, ChevronRight
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-xl font-semibold mt-1">{value}</p>
      </div>
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
  </div>
);

const ProfileSection = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const AchievementCard = ({ title, date, icon: Icon }) => (
  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="p-2 bg-gray-100 rounded-full">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div className="flex-1">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </div>
);

const SettingsItem = ({ icon: Icon, title, description }) => (
  <button className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors text-left">
    <div className="p-2 bg-gray-100 rounded-full">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div className="flex-1">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400 mt-2" />
  </button>
);

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-6 py-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Олександр Петренко</h1>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600">oleksandr@example.com</p>
              <div className="flex gap-4 mt-2">
                <span className="text-sm text-gray-500">Учасник з 2023</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Київ, Україна</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-t">
            <button 
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'profile' 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Профіль
            </button>
            <button 
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'settings' 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Налаштування
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === 'profile' ? (
          <div className="grid gap-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard title="Участь у турнірах" value="12" icon={Trophy} />
              <StatCard title="Перемоги" value="3" icon={Medal} />
            </div>

            {/* Recent Activity */}
            <ProfileSection title="Остання активність">
              <div className="space-y-2">
                <AchievementCard 
                  title="Перемога у турнірі 'Весняний кубок 2024'"
                  date="15 березня 2024"
                  icon={Trophy}
                />
                <AchievementCard 
                  title="Досягнення: 10 турнірів"
                  date="1 березня 2024"
                  icon={Medal}
                />
              </div>
            </ProfileSection>

            {/* Statistics */}
            <ProfileSection title="Статистика">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Відсоток перемог</span>
                  <span className="font-medium">67%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Найдовша серія перемог</span>
                  <span className="font-medium">5 матчів</span>
                </div>
              </div>
            </ProfileSection>
          </div>
        ) : (
          <div className="space-y-4">
            <ProfileSection title="Налаштування акаунту">
              <div className="space-y-2">
                <SettingsItem 
                  icon={User}
                  title="Особиста інформація"
                  description="Змініть ім'я, email та інші особисті дані"
                />
                <SettingsItem 
                  icon={Lock}
                  title="Безпека"
                  description="Налаштування паролю"
                />
                <SettingsItem 
                  icon={Clock}
                  title="Часовий пояс"
                  description="Налаштування часового поясу та формату дати"
                />
                <button className="w-full mt-4 p-4 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span>Вийти з акаунту</span>
                  </div>
                </button>
              </div>
            </ProfileSection>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
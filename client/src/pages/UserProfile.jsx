import React, { useState, useEffect } from 'react';
import { 
  User, Settings, Trophy, Shield, 
  Medal, Clock, Edit, Camera,
  Bell, Lock, LogOut, ChevronRight, ArrowLeft,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../AuthContext';
import axios from 'axios';

const Dialog = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }) => (
  <div className="px-6 py-4 border-b">
    <h2 className="text-lg font-semibold">{children}</h2>
  </div>
);

const DialogContent = ({ children }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

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

const SettingsModal = ({ icon: Icon, title, description, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
      >
        <div className="p-2 bg-gray-100 rounded-full">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 mt-2" />
      </button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogHeader>{title}</DialogHeader>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </>
  );
};

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [username, setUserName] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        setUser(response.data);
        setUserName(response.data.username);
        setName(response.data.name);
        setSurname(response.data.surname);
        setEmail(response.data.email);
        setCity(response.data.city);
        setCountry(response.data.country);

      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();  
  };

  const handleUpdate = async () => {
    const token = getToken();
    try {
        const response = await axios.patch('http://localhost:5000/api/user/update', { name, surname, email, city, country }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('User data updated:', response.data);
        setMessage('Дані оновлено успішно!');
    } catch (error) {
        console.error('Error updating user data:', error);
        setMessage('Помилка при оновленні даних.');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Усі поля повинні бути заповнені');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Паролі не співпадають');
      return;
    }
  
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch('http://localhost:5000/api/user/change-password', 
        { currentPassword, newPassword }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('Пароль змінено успішно!');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage(error.response.data.message || 'Помилка при зміні пароля.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 py-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Повернутися назад</span>
          </button>
          
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
              {loading ? (
                <p>Завантаження...</p> // Loading message
              ) : user ? (
                <div>
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                  </div>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-sm text-gray-500">{user.name} {user.surname}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{user.city}, {user.country}</span>
                  </div>
                </div>
              ) : (
                <p>Не вдалося завантажити дані користувача.</p> // Error message
              )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard title="Участь у турнірах" value="12" icon={Trophy} />
              <StatCard title="Перемоги" value="3" icon={Medal} />
            </div>

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
                <SettingsModal 
                  icon={User}
                  title="Особиста інформація"
                  description="Змініть ім'я, email та інші особисті дані"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ім'я:</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Фамілія:</label>
                      <input 
                        type="text" 
                        value={surname} 
                        onChange={(e) => setSurname(e.target.value)} 
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email:</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Місто:</label>
                      <input 
                        type="text" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Країна:</label>
                      <input 
                        type="text" 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)} 
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <button 
                      onClick={handleUpdate} 
                      className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                    >
                      Зберегти зміни
                    </button>
                    {message && <p className="text-sm text-green-600">{message}</p>} {/* Success/Error message */}
                  </div>
                </SettingsModal>

                <SettingsModal 
      icon={Lock}
      title="Безпека"
      description="Налаштування паролю"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Поточний пароль</label>
          <input 
            type="password" 
            className="w-full p-2 border rounded-md"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Новий пароль</label>
          <input 
            type="password" 
            className="w-full p-2 border rounded-md"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Підтвердження паролю</label>
          <input 
            type="password" 
            className="w-full p-2 border rounded-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button 
          onClick={handleChangePassword} 
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
        >
          Оновити пароль
        </button>
        {message && <p className="text-red-500">{message}</p>}
      </div>
    </SettingsModal>

                <SettingsModal 
                  icon={Clock}
                  title="Часовий пояс"
                  description="Налаштування часового поясу та формату дати"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Часовий пояс</label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="Europe/Kiev">Київ (UTC+2)</option>
                        <option value="Europe/London">Лондон (UTC+0)</option>
                        <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Формат дати</label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
                      Зберегти налаштування
                    </button>
                  </div>
                </SettingsModal>

                <button className="w-full mt-4 p-4 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={handleLogout}>
                  <LogOut className="w-5 h-5 inline-block mr-2" />
                  Вийти
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


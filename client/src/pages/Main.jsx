import React, { useState, useEffect } from 'react';
import { Settings, Trophy, Users, Calendar, BarChart } from 'lucide-react';
import axios from 'axios';

const Header = ({ onSettingsClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 flex justify-between items-center p-4 border-b transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6" />
        <span className="text-xl font-semibold">ЗмаганняТрекер</span>
      </div>
      <button onClick={onSettingsClick} className="p-2 hover:bg-gray-100 rounded-full">
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
};

const Navigation = () => (
  <nav className="relative flex gap-6 p-4 border-b bg-white z-0">
    <button className="flex items-center gap-2 hover:text-blue-600">
      <Trophy className="w-5 h-5" />
      <span>Турніри</span>
    </button>
    <button className="flex items-center gap-2 hover:text-blue-600">
      <Calendar className="w-5 h-5" />
      <span>Матчі</span>
    </button>
    <button className="flex items-center gap-2 hover:text-blue-600">
      <BarChart className="w-5 h-5" />
      <span>Результати матчів</span>
    </button>
  </nav>
);

// Tournament Card component
const TournamentCard = ({ teams, startDate, status }) => (
  <div className="bg-white rounded-lg shadow-sm mb-4 hover:shadow-lg transition-shadow">
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span>{teams} команд</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span>Початок: {startDate}</span>
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {status}
        </span>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="text-blue-600 hover:text-blue-800">
          Детальніше →
        </button>
      </div>
    </div>
  </div>
);

// User Profile Modal
const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // Function to retrieve the token from local storage
  const getToken = () => {
    return localStorage.getItem('token'); // Get the token from local storage
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        console.error("No token found");
        return; // Exit if there's no token
      }
      try {
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the headers
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data); // Store user data in state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);  // Empty dependency array, fetch user data once on mount

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/change-password',
        { newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error changing password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Профіль користувача</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        {user ? (
          <div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.username}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <input
                  type="password"
                  placeholder="Новий пароль"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button onClick={handleChangePassword} className="w-full p-2 bg-blue-600 text-white rounded">
                  Змінити пароль
                </button>
                {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
              </div>

              <button className="w-full p-2 text-left text-red-600 hover:bg-red-50 rounded mt-4" onClick={onClose}>
                Вийти
              </button>
            </div>
          </div>
        ) : (
          <p>Завантаження інформації...</p>
        )}
      </div>
    </div>
  );
};

// Main App component
const TournamentTracker = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-16"> {/* Add padding to the top to prevent content overlap */}
      <Header onSettingsClick={() => setShowProfile(true)} />
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-6">
        {/* Тури на реєстрацію Section */}
        <section>
          <h1 className="text-2xl font-bold mb-4">Турніри на реєстрацію</h1>
          <TournamentCard
            teams="12"
            startDate="10 червня 2024"
            status="Очікується"
          />
          <TournamentCard
            teams="8"
            startDate="20 червня 2024"
            status="Очікується"
          />
        </section>

        {/* Актуальні турніри Section */}
        <section className="mt-8">
          <h1 className="text-2xl font-bold mb-4">Актуальні турніри</h1>
          <TournamentCard
            teams="16"
            startDate="15 травня 2024"
            status="Активний"
          />
          <TournamentCard
            teams="8 з 12"
            startDate="1 червня 2024"
            status="Реєстрація"
          />
        </section>

        {/* Попередні турніри Section */}
        <section className="mt-8">
          <h1 className="text-2xl font-bold mb-4">Попередні турніри</h1>
          <TournamentCard
            teams="10"
            startDate="1 вересня 2024"
            status="Завершено"
          />
        </section>
      </main>

      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </div>
  );
};

export default TournamentTracker;

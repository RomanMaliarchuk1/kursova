import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useAuth } from '../AuthContext';

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        setUser(response.data);
      } catch (error) {
        setMessage('Failed to load user data');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
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
              <button className="w-full p-2 text-left hover:bg-gray-100 rounded" onClick={() => { navigate('/profile'); onClose(); }}>Перейти в профіль</button>
              <button className="w-full p-2 text-left text-red-600 hover:bg-red-50 rounded mt-4" onClick={handleLogout}>Вийти</button>
            </div>
          </div>
        ) : (
          <p>{message || 'Завантаження інформації...'}</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

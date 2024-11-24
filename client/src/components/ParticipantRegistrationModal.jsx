import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const ParticipantRegistrationModal = ({ onClose, tournamentId, handleRegisterParticipant }) => {
  const [user, setUser] = useState(null);  // Стан для користувача
  const [message, setMessage] = useState(''); // Стан для повідомлень про помилки
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

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
        setFormData({
          name: response.data.username, // Ініціалізуємо поля форми
          email: response.data.email
        });
      } catch (error) {
        setMessage('Failed to load user data');
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegisterParticipant(tournamentId, formData);
      onClose();
    } catch (error) {
      setMessage('Error registering participant: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  if (!user) return null; // Якщо користувач ще не завантажений, не рендеримо форму

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Реєстрація учасника</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Display Error Message */}
          {message && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm">
              {message}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Ім'я</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
              placeholder="Введіть ім'я"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
              placeholder="Введіть email"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Зареєструвати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantRegistrationModal;

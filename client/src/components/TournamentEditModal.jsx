import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

const TournamentEditModal = ({ onClose, tournament, handleSaveTournament }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    teams: '',
    startDate: '',
    endDate: '',
    type: '',
    status: '',
    prizePool: '',
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10); // Відображає yyyy-mm-dd
  };
  
  
  useEffect(() => {
    if (tournament) {
      setFormData({
        id: tournament.id,
        name: tournament.name,
        description: tournament.description,
        max_participants: tournament.max_participants,
        startDate: formatDate(tournament.start_date),
        endDate: formatDate(tournament.end_date),
        type: tournament.type,
        status: tournament.status,
        prize_pool: tournament.prize_pool, 
      });
    }
  }, [tournament]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: (name === 'max_participants' || name === 'prize_pool') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSaveTournament(formData);
      onClose();
    } catch (error) {
      console.error("Error saving tournament:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Редагування турніру</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Поле назви */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Назва турніру</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
              placeholder="Введіть назву турніру"
            />
          </div>

          {/* Поле опису */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Опис турніру</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all resize-none"
              placeholder="Опишіть деталі турніру"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Кількість учасників
            </label>
            <input
              type="number"
              id="max_participants"
              name="max_participants"
              value={formData.max_participants}
              min="2"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all resize-none"
              placeholder="Введіть кількість учасників"
            />
          </div>

          {/* Призовий пул */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Призовий пул
            </label>
            <input
              type="number"
              id="prize_pool"
              name="prize_pool"
              value={formData.prize_pool}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
              placeholder="Введіть призовий пул"
            />
          </div>

          {/* Поля дат */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Дата початку</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Дата завершення</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Тип турніру */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Тип турніру</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'single' })}
                className={`p-3 border rounded-lg text-sm font-medium transition-all ${formData.type === 'single' ? 'border-gray-900 text-white bg-gray-900' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              >
                Single Elimination
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'double' })}
                className={`p-3 border rounded-lg text-sm font-medium transition-all ${formData.type === 'double' ? 'border-gray-900 text-white bg-gray-900' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              >
                Double Elimination
              </button>
            </div>
          </div>

          {/* Статус */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Статус турніру</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'upcoming' })}
                className={`p-3 border rounded-lg text-sm font-medium transition-all ${formData.status === 'upcoming' ? 'border-gray-900 text-white bg-gray-900' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              >
                Реєстрація
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'active' })}
                className={`p-3 border rounded-lg text-sm font-medium transition-all ${formData.status === 'active' ? 'border-gray-900 text-white bg-gray-900' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              >
                Активний
              </button>
            </div>
          </div>
        </form>

        {/* Підвал */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cancel"
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Зберегти зміни
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentEditModal;

import React, { useState } from 'react';
import { X } from 'lucide-react';

// Custom Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

const CreateTournamentDialog = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [max_participants, setMaxParticipants] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('single'); // Значення за замовчуванням
  const [description, setDescription] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [prize_pool, setPrizePool] = useState('');  

  const handleSubmit = () => {
    if (max_participants < 2) {
      alert('Кількість учасників повинна бути не менша за 2');
      return;
    }
    
    const newTournament = {
      name: title,
      max_participants,
      start_date: startDate,
      end_date: endDate,
      type,
      status: 'Upcoming',
      creator_id: creatorId,
      description,
      prize_pool,
    };
    onCreate(newTournament);
    setTitle('');
    setMaxParticipants();
    setStartDate('');
    setEndDate('');
    setType('single');
    setDescription('');
    setPrizePool();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Створити новий турнір</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Назва турніру
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введіть назву турніру"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Кількість команд
          </label>
          <input
            type="number"
            value={max_participants}
            onChange={(e) => setMaxParticipants(Number(e.target.value))}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введіть кількість команд"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата початку
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата завершення
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип турніру
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="single">Одноразове усунення</option>
            <option value="double">Подвійне усунення</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Опис турніру
          </label>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Опишіть деталі турніру"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Призовий фонд
          </label>
          <input
            type="number"
            value={prize_pool}
            onChange={(e) => setPrizePool(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введіть призовий фонд"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Скасувати
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Створити турнір
        </button>
      </div>
    </Modal>
  );
};

export default CreateTournamentDialog;

// src/components/TournamentCard.js
import React from 'react';
import { Users, Calendar } from 'lucide-react';

const TournamentCard = ({ title, teams, startDate, status }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-4 mt-2 text-gray-600">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {teams} команд
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {startDate}
          </span>
        </div>
      </div>
      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
        {status}
      </span>
    </div>
  </div>
);

export default TournamentCard;

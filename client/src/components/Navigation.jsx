// Navigation.js
import React from 'react';
import { Trophy, Calendar, BarChart } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => (
  <nav className="flex gap-6 p-4 border-b z-0 bg-white">
    <button
      onClick={() => setActiveTab("tournaments")}
      className={`flex items-center gap-2 ${activeTab === "tournaments" ? 'text-blue-600' : 'hover:text-blue-600'}`}
    >
      <Trophy className="w-5 h-5" />
      <span>Турніри</span>
    </button>
    <button
      onClick={() => setActiveTab("matches")}
      className={`flex items-center gap-2 ${activeTab === "matches" ? 'text-blue-600' : 'hover:text-blue-600'}`}
    >
      <Calendar className="w-5 h-5" />
      <span>Матчі</span>
    </button>
    <button
      onClick={() => setActiveTab("results")}
      className={`flex items-center gap-2 ${activeTab === "results" ? 'text-blue-600' : 'hover:text-blue-600'}`}
    >
      <BarChart className="w-5 h-5" />
      <span>Результати матчів</span>
    </button>
  </nav>
);

export default Navigation;

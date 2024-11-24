import React, { useState, useEffect } from 'react';
import { Settings, Trophy } from 'lucide-react';

const Header = ({ onSettingsClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 flex justify-between items-center p-4 border-b ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6" />
        <span className="text-xl font-semibold">CompetiFlow</span>
      </div>
      <button onClick={onSettingsClick} className="p-2 hover:bg-gray-100 rounded-full">
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Header;

import React, { useState } from 'react';
import Header from '../components/MainPageHeader';
import Navigation from '../components/Navigation';
import MainTabs from '../components/MainTabs';
import UserProfile from '../components/UserProfile';

const TournamentTracker = () => {
  const [showProfile, setShowProfile] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header onSettingsClick={() => setShowProfile(true)} />
      <main className="flex gap-6 p-4 border-b z-0 bg-white">
        <MainTabs />
      </main>
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </div>
  );
};

export default TournamentTracker;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, ArrowLeft, Trophy, Users, Calendar } from 'lucide-react';
import { useAuth } from '../AuthContext';

const TournamentPage = () => {
  const { tournamentId } = useParams();
  const { currentUserId } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [matches, setMatches] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [tournamentDetails, setTournamentDetails] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
  };

  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return null;
    }
    return token;
  };

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/tournaments/${tournamentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTournamentDetails(response.data);
      } catch (error) {
        console.error('Error fetching tournament details:', error);
      }
    };

    const fetchParticipants = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/participants/${tournamentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParticipants(response.data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    const fetchMatches = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/matches/${tournamentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchTournamentDetails();
    fetchParticipants();
    fetchMatches();
  }, [tournamentId]);

  const handleGenerateMatches = async () => {
    const token = getToken();
    try {
      const response = await axios.post(`http://localhost:5000/api/matches/generate/${tournamentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Matches generated successfully');
      setMatches(response.data);
    } catch (error) {
      console.error('Error generating matches:', error);
      alert('Error generating matches');
    }
  };

  const handleSelectWinner = async (matchId, winnerId) => {
    const token = getToken();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/matches/${matchId}/select-winner`,
        { winnerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert(response.data.message || 'Переможець обраний успішно');
  
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.match_id === matchId
            ? { ...match, winner_id: winnerId, status: 'completed' }
            : match
        )
      );
    } catch (error) {
      console.error('Помилка під час вибору переможця:', error.response || error);
      alert(error.response?.data?.message || 'Помилка під час вибору переможця');
    }
  };

  const PlayerMatch = ({
    matchId,
    participant1,
    participant2,
    participant1_name,
    participant2_name,
    match_date,
    isCompleted,
    onSelectWinner,
    tournamentDetails,
    currentUserId
  }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    const handleSelectWinner = (participantId) => {
      onSelectWinner(matchId, participantId);
      setIsMenuOpen(false);
    };
  
    return (
      <div className="bg-white rounded-lg border border-md shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <span className="font-medium text-sm">{participant1_name}</span>
                </div>
              </div>
  
              <div className="flex-col items-center">
                <div className="text-lg font-medium text-gray-500">vs</div>
              </div>
  
              <div className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <span className="font-medium text-sm">{participant2_name}</span>
                </div>
              </div>
            </div>
          </div>
  
          <div className="ml-8 text-right">
            <div className="font-medium text-gray-900">{match_date}</div>
            <div className="text-sm text-gray-500">
              {isCompleted ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Завершено
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Очікується
                </span>
              )}
            </div>
          </div>
        </div>
  
        {tournamentDetails?.creator_id === currentUserId && !isCompleted && (
          <div className="mt-4 relative" ref={menuRef}>
            <button
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200 flex items-center justify-center gap-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span>Вибрати переможця</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
  
            {isMenuOpen && (
              <div className="absolute z-10 mt-2 w-full sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <button
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                  onClick={() => handleSelectWinner(participant1)}
                >
                  <User className="w-4 h-4" />
                  {participant1_name}
                </button>
                <button
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                  onClick={() => handleSelectWinner(participant2)}
                >
                  <User className="w-4 h-4" />
                  {participant2_name}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-48 bg-white flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full" />
        <div className="z-10 text-center w-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 py-4 text-gray-600 hover:text-gray-900 transition-colors absolute left-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Повернутися назад</span>
            </button>
            <h1 className="text-3xl font-bold mb-2">{tournamentDetails ? tournamentDetails.name : 'Loading...'}</h1>
            <div className="text-2xl mb-2">
              {tournamentDetails ? `${formatDate(tournamentDetails.start_date)} - ${formatDate(tournamentDetails.end_date)}` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="max-w-5xl mx-auto px-6 flex gap-8 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 relative ${activeTab === 'overview' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
          >
            Загальна інформація
            {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`py-4 relative ${activeTab === 'matches' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
          >
            Матчі
            {activeTab === 'matches' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Tournament Info */}
            <div className="bg-white p-6 rounded-lg border border-md shadow-md">
              <h2 className="text-xl font-bold mb-4">Інформація про турнір</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600">Дата</span>
                  </div>
                  <p className="font-medium">{tournamentDetails ? `${formatDate(tournamentDetails.start_date)} - ${formatDate(tournamentDetails.end_date)}` : 'Loading...'}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600">Призовий фонд</span>
                  </div>
                  <p className="font-medium">{tournamentDetails ? `$${tournamentDetails.prize_pool}` : 'Loading...'}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600">Учасники</span>
                  </div>
                  <p className="font-medium">{tournamentDetails ? `${tournamentDetails.max_participants} учасники` : 'Loading...'}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-gray-400">Формат</h3>
                  <p>{tournamentDetails ? `${tournamentDetails.type} elimination` : 'Loading...'}</p>
                </div>
              </div>
            </div>

            {/* Participants List */}
            <div className="bg-white p-6 rounded-lg border border-md">
              <h2 className="text-xl font-bold mb-4">Учасники</h2>
              <div className="grid grid-cols-2 gap-4">
                {participants.length > 0 ? (
                  participants.map((participant) => (
                    <div key={participant.user_id} className="flex items-center p-4 bg-gray-50 rounded-lg gap-2">
                      <User className="w-6 h-6 text-gray-400"/>
                      <span>
                        {participant.username} | {participant.name} {participant.surname}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>Учасники не додані</p>
                )}
              </div>
            </div>
          </div>
        )}

{activeTab === "matches" && (
  <div className="mx-auto">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-medium">Турнірні матчі</h2>
      {tournamentDetails.creator_id === currentUserId && (
        <button
          onClick={handleGenerateMatches}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Згенерувати матчі
        </button>
      )}
    </div>
    <div className="bg-white rounded-lg p-6">
      <div className="space-y-6">
        {/* Active Matches */}
        <div className="mx-auto grid gap-4">
          <h3 className="text-md font-medium">Активні матчі</h3>
          {matches.length > 0 ? (
            matches
              .filter((match) => match.status === "active")
              .map((match, index) => (
                <PlayerMatch
                  key={index}
                  matchId={match.match_id}
                  participant1={match.participant1_id}
                  participant2={match.participant2_id}
                  participant1_name={
                    match.participant1_name && match.participant1_surname
                      ? `${match.participant1_name} ${match.participant1_surname}`
                      : "Unknown"
                  }
                  participant2_name={
                    match.participant2_name && match.participant2_surname
                      ? `${match.participant2_name} ${match.participant2_surname}`
                      : "Unknown"
                  }
                  match_date={formatDate(match.match_date)}
                  isCompleted={!!match.winner_id}
                  onSelectWinner={handleSelectWinner}
                  tournamentDetails = {tournamentDetails}
                  currentUserId = {currentUserId}
                />
              ))
          ) : (
            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                    Немає активних матчів.
            </div>
          )}
        </div>

        {/* Completed Matches */}
        <div className="mx-auto grid gap-4">
          <h3 className="text-md font-medium">Завершені матчі</h3>
          {matches.length > 0 ? (
            matches
              .filter((match) => match.status === "completed")
              .map((match, index) => (
                <PlayerMatch
                  key={index}
                  matchId={match.match_id}
                  participant1={match.participant1_id}
                  participant2={match.participant2_id}
                  participant1_name={
                    match.participant1_name && match.participant1_surname
                      ? `${match.participant1_name} ${match.participant1_surname}`
                      : "Unknown"
                  }
                  participant2_name={
                    match.participant2_name && match.participant2_surname
                      ? `${match.participant2_name} ${match.participant2_surname}`
                      : "Unknown"
                  }
                  match_date={formatDate(match.match_date)}
                  isCompleted={!!match.winner_id}
                  onSelectWinner={handleSelectWinner}
                />
              ))
          ) : (
            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                    Немає завершених матчів.
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
    </div>
  );
};

export default TournamentPage;

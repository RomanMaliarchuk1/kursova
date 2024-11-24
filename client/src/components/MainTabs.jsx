import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, BarChart, Plus, Users, Clock, CheckCircle, ChevronRight, Trash, Edit } from 'lucide-react';
import CreateTournamentDialog from './CreateTournamentDialog';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import TournamentEditModal from './TournamentEditModal';
import PlayerMatch from './PlayerMatch';
import ParticipantRegistrationModal from './ParticipantRegistrationModal';

const MainTabs = () => {
    const [activeTab, setActiveTab] = useState("tournaments");
    const [message, setMessage] = useState('');
    const [activeTournamentTab, setActiveTournamentTab] = useState("registration");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [tournaments, setTournaments] = useState([]);
    const navigate = useNavigate();
    const { currentUserId } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [matches, setMatches] = useState([]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('uk-UA', options);
    };

    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token not found in localStorage");
        }
        return token;
    };

    useEffect(() => {
        const fetchTournaments = async () => {
            const token = getToken();
            try {
                const response = await axios.get('http://localhost:5000/api/tournaments', {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                });
                const tournamentData = response.data;

           
                const updatedTournaments = await Promise.all(tournamentData.map(async (tournament) => {
                    const participantCountResponse = await axios.get(`http://localhost:5000/api/participants/count/${tournament.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    return {
                        ...tournament,
                        registeredParticipants: participantCountResponse.data.count,
                    };
                }));
                setTournaments(updatedTournaments);;
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        const fetchMatches = async () => {
            const token = getToken();
            if (!token) return;
            try {
              const response = await axios.get(`http://localhost:5000/api/matches`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setMatches(response.data);
            } catch (error) {
              console.error('Error fetching matches:', error);
            }
        };

        fetchTournaments();
        fetchMatches();

    }, []);

    const openRegistrationTournaments = tournaments.filter(tournament => tournament.status === 'upcoming');
    const activeTournaments = tournaments.filter(tournament => tournament.status === 'active');

    const tabStyle = (isActive) => `
      flex items-center gap-2 px-4 py-2 font-medium rounded-md
      ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}
    `;

    const subTabStyle = (isActive) => `
      flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md
      ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}
    `;

    const handleCreateTournament = async (newTournament) => {
        const token = getToken();
        try {
            const response = await axios.post('http://localhost:5000/api/tournaments', {
                ...newTournament,
                creator_id: currentUserId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.status === 201) {
                const tournament = {
                    ...response.data,
                };
                setTournaments((prevTournaments) => [...prevTournaments, tournament]);
                setShowCreateDialog(false);
            } else {
                console.error('Failed to create tournament:', response.status);
            }
        } catch (error) {
            console.error('Error creating tournament:', error);
        }
    };

    const handleDeleteTournament = async (tournamentId) => {
        const token = getToken();
        try {
            const response = await axios.delete(`http://localhost:5000/api/tournaments/${tournamentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.status === 200) {
                setTournaments((prevTournaments) => 
                    prevTournaments.filter(tournament => tournament.id !== tournamentId)
                );
            } else {
                console.error('Failed to delete tournament:', response.status);
            }
        } catch (error) {
            console.error('Error deleting tournament:', error);
        }
    };

    const handleEditTournament = (tournament) => {
        setSelectedTournament(tournament);
        setIsEditModalOpen(true);
    };

    const handleSaveTournament = async (updatedTournament) => {
        const token = getToken();
        try {
            const response = await axios.patch(`http://localhost:5000/api/tournaments/${updatedTournament.id}`, 
                updatedTournament, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.status === 200) {
                setTournaments((prevTournaments) =>
                    prevTournaments.map((tournament) =>
                        tournament.id === updatedTournament.id ? { ...tournament, ...updatedTournament } : tournament
                    )
                );
                setIsEditModalOpen(false);
                setSelectedTournament(null);
            } else {
                console.error('Failed to update tournament:', response.status);
            }
        } catch (error) {
            console.error('Error updating tournament:', error);
        }
    };

    const handleRegisterParticipant = async (tournamentId, participantData) => {
        const token = getToken();
        if (!token) {
            alert("Token is required to register.");
            return;
        }
        try {
            const response = await axios.post(
                `http://localhost:5000/api/tournaments/${tournamentId}/register`,
                participantData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.error(response.data.message);
        } catch (error) {
            console.error("Error registering participant:", error);
            console.error(error.response?.data?.message || "An error occurred while registering");
        }
    };

    const handleViewRegisterModal = (tournament) => {
        setSelectedTournament(tournament);
        setIsRegisterModalOpen(true);
    };

    return (
        <div className="w-full px-6 py-4 bg-gradient-to-b from-custom-white to-custom-gray">
            {/* Main Tabs */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab("tournaments")}
                    className={tabStyle(activeTab === "tournaments")}
                >
                    <Trophy className="w-4 h-4" />
                    Турніри
                </button>
                <button
                    onClick={() => setActiveTab("matches")}
                    className={tabStyle(activeTab === "matches")}
                >
                    <Calendar className="w-4 h-4" />
                    Матчі
                </button>
                <button
                    onClick={() => setActiveTab("results")}
                    className={tabStyle(activeTab === "results")}
                >
                    <BarChart className="w-4 h-4" />
                    Результати матчів
                </button>
            </div>

            {/* Tournaments Content */}
            {activeTab === "tournaments" && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTournamentTab("registration")}
                                className={subTabStyle(activeTournamentTab === "registration")}
                            >
                                <Clock className="w-4 h-4" />
                                Реєстрація відкрита
                            </button>
                            <button
                                onClick={() => setActiveTournamentTab("ongoing")}
                                className={subTabStyle(activeTournamentTab === "ongoing")}
                            >
                                <CheckCircle className="w-4 h-4" />
                                Активні турніри
                            </button>
                        </div>
                        
                        {activeTournamentTab === "registration" && (
                            <button
                                onClick={() => setShowCreateDialog(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4" />
                                Створити турнір
                            </button>
                        )}
                    </div>

                    {/* Tournament Cards */}
                    <div className="max-w-6xl mx-auto flex justify-between gap-4 flex-wrap">
                        {(activeTournamentTab === "registration" ? openRegistrationTournaments : activeTournaments).map((tournament) => (
                            <div
                                key={tournament.id}
                                className="w-full bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200 transform hover:translate-y-[-5px] transition-transform duration-200"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-start gap-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
                                                {tournament.creator_id === currentUserId && (
                                                    <button 
                                                        onClick={() => handleEditTournament(tournament)}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-600">{formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-800">Учасників: {tournament.registeredParticipants} / {tournament.max_participants}</p>
                                            <p className={`px-3 py-1 rounded-full text-center text-sm ${tournament.status === "upcoming" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                                                {tournament.status === "upcoming" ? "Реєстрація" : "Активний"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-700 mb-4">{tournament.description}</p>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">{tournament.type} elimination</span>
                                            <span className="text-sm text-gray-500">Prize pool: {tournament.prize_pool}</span>
                                        </div>
                                     <div className="flex items-center gap-2">
                                        {tournament.creator_id === currentUserId ? (
                                            <>
                                                <button
                                                    onClick={() => handleDeleteTournament(tournament.id)}
                                                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                    Видалити
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/tournament/${tournament.id}`)}
                                                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                    Детальніше
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                            {tournament.status !== 'active' && tournament.registeredParticipants < tournament.max_participants ? (
                                            <button
                                                onClick={() => handleViewRegisterModal(tournament)}
                                                className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 bg-green-50 rounded-md hover:bg-green-100"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Зареєструватися
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded-md"
                                            >
                                                Реєстрація закрита
                                            </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/tournament/${tournament.id}`)}
                                                className="flex items-center gap-1 px-3 py-1 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                                Детальніше
                                            </button>
                                            </>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Matches Content */}
            {activeTab === "matches" && (
                <div className="mx-auto grid p-6">
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
                        />
                      ))
                  ) : (
                    <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                      Немає активних матчів.
                    </div>
                  )}
                </div>
              )}
              
      {/* Results Content */}
      {activeTab === "results" && (
        <div className="mx-auto p-6 grid gap-4">
        <h3 className="text-md font-medium">Завершені матчі</h3>
        {matches.length > 0 ? (
          matches
            .filter((match) => match.status === "completed")
            .map((match, index) => (
            <div className="grid grid-cols-1 gap-4">
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
                winnerId={match.winner_id}
              />
            </div>
            ))
        ) : (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                  Немає завершених матчів.
          </div>
        )}
      </div>
      )}
      
            {/* Create Tournament Dialog */}
            <CreateTournamentDialog 
                isOpen={showCreateDialog} 
                onClose={() => setShowCreateDialog(false)} 
                onCreate={handleCreateTournament}
            />

            {/* Edit Tournament Modal */}
            {isEditModalOpen && (
                <TournamentEditModal
                    tournament={selectedTournament}
                    onClose={() => setIsEditModalOpen(false)}
                    handleSaveTournament={handleSaveTournament}
                />
            )}

            {isRegisterModalOpen && (
                <ParticipantRegistrationModal
                    onClose={() => setIsRegisterModalOpen(false)}
                    tournamentId={selectedTournament?.id}
                    handleRegisterParticipant={handleRegisterParticipant}
                />
            )}

        </div>
    );
};

export default MainTabs;

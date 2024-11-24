const Match = require('../models/Match');
const Participant = require('../models/Participant');

const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.getAllMatches();
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching all matches:', error);
    res.status(500).send('Error fetching match data');
  }
};

// Функція для генерації матчів для турніру
const generateMatches = (req, res) => {
  const { tournament_id } = req.params;

  Participant.getParticipantsByTournamentId(tournament_id)
    .then(participants => {
      if (participants.length < 2) {
        return res.status(400).json({ error: 'Not enough participants to generate matches' });
      }

      console.log('Participants fetched:', participants);

      const numberOfMatches = Math.floor(participants.length / 2);
      console.log('Number of matches to generate:', numberOfMatches);
      const shuffledParticipants = participants.sort(() => Math.random() - 0.5);
      const matches = [];

      // Генерація матчів
      (async () => {
        for (let i = 0; i < numberOfMatches; i++) {
          const participant1 = shuffledParticipants[i * 2];
          const participant2 = shuffledParticipants[i * 2 + 1];

          if (!participant2) break;

          const participant1_id = participant1.id;
          const participant2_id = participant2.id;

          try {
            const matchExists = await Match.checkMatchExists(tournament_id, participant1_id, participant2_id);

            if (!matchExists) {
              const match = {
                tournament_id: tournament_id,
                round: 1,
                participant1_id: Math.min(participant1_id, participant2_id),
                participant2_id: Math.max(participant1_id, participant2_id),
                winner_id: null,
                match_date: new Date(),
                participant1_info: {
                  username: shuffledParticipants[i].username,
                  name: shuffledParticipants[i].name,
                  surname: shuffledParticipants[i].surname,
                },
                participant2_info: {
                  username: shuffledParticipants[i + 1].username,
                  name: shuffledParticipants[i + 1].name,
                  surname: shuffledParticipants[i + 1].surname,
                },
              };

              matches.push(match);
            } else {
              console.log('Match already exists between participants:', participant1_id, participant2_id);
            }
          } catch (error) {
            console.error('Error checking for existing match:', error);
            return res.status(500).json({ error: 'Error checking for existing match' });
          }

          if (matches.length >= numberOfMatches) {
            break;
          }
        }

        console.log('Generated matches:', matches);

        if (matches.length > 0) {
          Match.addMatches(matches, (err, result) => {
            if (err) {
              console.error('Error saving matches:', err);
              return res.status(500).json({ error: 'Error saving matches' });
            }
            console.log('Matches saved successfully:', result);
            return res.status(201).json({ message: 'Matches generated successfully', matches });
          });
        } else {
          return res.status(400).json({ error: 'No new matches generated (duplicates found)' });
        }
      })();
    })
    .catch(error => {
      console.error('Error fetching participants:', error);
      return res.status(500).json({ error: 'Error fetching participants' });
    });
};

const getMatchesByTournamentId = (req, res) => {
    const { tournament_id } = req.params;

    Match.getMatchesByTournament(tournament_id, (err, results) => {
        if (err) {
            console.error('Error fetching matches:', err);
            return res.status(500).json({ error: 'Error fetching matches' });
        }
        res.status(200).json(results);
    });
};

const selectWinner = async (req, res) => {
  const { matchId } = req.params;
  const { winnerId } = req.body;

  if (!matchId || !winnerId) {
    return res.status(400).json({ message: 'Неправильні дані' });
  }

  try {
    const match = await Match.getMatchById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Матч не знайдено' });
    }
    if (![match.participant1_id, match.participant2_id].includes(winnerId)) {
      return res.status(400).json({ message: 'Неправильний учасник' });
    }

    const result = await Match.updateMatchWinner(matchId, winnerId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Матч не знайдено для оновлення' });
    }
    res.status(200).json({ message: 'Переможець обраний успішно' });
  } catch (error) {
    console.error('Помилка під час вибору переможця:', error);
    res.status(500).json({ message: 'Сталася помилка' });
  }
};


module.exports = {
    generateMatches,
    getMatchesByTournamentId,
    selectWinner,
    getAllMatches,
};

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const participantRoutes = require('./routes/participantRoutes');
const matchRoutes = require('./routes/matchRoutes');

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', tournamentRoutes);
app.use('/api', participantRoutes);
app.use('/api', matchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

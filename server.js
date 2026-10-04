require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL database successfully!'))
    .catch(err => console.error('Database connection error:', err));

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'YVP Backend is running successfully!' });
});

// 1. Membership Form Route
app.post('/api/members', async (req, res) => {
    try {
        const { full_name, college, state, course, membership_id } = req.body;
        const query = `
            INSERT INTO members (full_name, college, state, course, membership_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [full_name, college, state, course, membership_id];
        const newMember = await pool.query(query, values);
        res.status(201).json({ success: true, data: newMember.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// 2. Grievances Form Route
app.post('/api/grievances', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const query = `
            INSERT INTO grievances (name, email, message)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [name, email, message];
        const newGrievance = await pool.query(query, values);
        res.status(201).json({ success: true, data: newGrievance.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// 3. Anti-Ragging Reports Route
app.post('/api/anti-ragging', async (req, res) => {
    try {
        const { reporter_name, college_city, incident_details } = req.body;
        const query = `
            INSERT INTO anti_ragging_reports (reporter_name, college_city, incident_details)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [reporter_name, college_city, incident_details];
        const newReport = await pool.query(query, values);
        res.status(201).json({ success: true, data: newReport.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// 4. Pillar Suggestions Route
app.post('/api/pillar-suggestions', async (req, res) => {
    try {
        const { pillar_name, user_info, suggestion } = req.body;
        const query = `
            INSERT INTO pillar_suggestions (pillar_name, user_info, suggestion)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [pillar_name, user_info, suggestion];
        const newSuggestion = await pool.query(query, values);
        res.status(201).json({ success: true, data: newSuggestion.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// 5. Voting Route
app.post('/api/votes', async (req, res) => {
    try {
        const { voter_id, reform_option } = req.body;
        const query = `
            INSERT INTO votes (voter_id, reform_option)
            VALUES ($1, $2) RETURNING *;
        `;
        const values = [voter_id, reform_option];
        const newVote = await pool.query(query, values);
        res.status(201).json({ success: true, data: newVote.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
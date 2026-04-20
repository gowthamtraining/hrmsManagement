const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.send('AI HRMS API is running...');
});

// Import Routes
const employeeRoutes = require('./routes/employeeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const surveyRoutes = require('./routes/surveyRoutes');

// Use Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/surveys', surveyRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms_db')
    .then(() => console.log('Connected to MongoDB Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
    });

// 404 Handler
app.use((req, res) => {
    console.log(`404: ${req.method} ${req.url} - Not Found`);
    res.status(404).json({ error: `Path ${req.url} with method ${req.method} not found` });
});

app.listen(PORT, () => {
    console.log(`🚀 AI HRMS Server running on port ${PORT}`);
});

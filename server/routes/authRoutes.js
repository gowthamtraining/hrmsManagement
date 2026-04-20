const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

// Register
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role, position, department, salary } = req.body;
        
        let existingUser = await Employee.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEmployee = new Employee({
            name,
            email,
            password: hashedPassword,
            role: role || 'Employee',
            position: position || 'N/A',
            department: department || 'General',
            salary: salary || 0
        });

        await newEmployee.save();

        const token = jwt.sign({ id: newEmployee._id, role: newEmployee.role }, JWT_SECRET, { expiresIn: '1d' });
        
        res.status(201).json({ token, user: { id: newEmployee._id, name: newEmployee.name, role: newEmployee.role, email: newEmployee.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await Employee.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.password) return res.status(400).json({ message: 'Legacy user without password. Ask HR to reset.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        
        res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get Current User
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Employee.findById(decoded.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
});

module.exports = router;

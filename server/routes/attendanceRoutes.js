const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

router.get('/', async (req, res) => {
    try {
        const attendance = await Attendance.find().populate('employee').limit(100);
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/check-in', async (req, res) => {
    const { employeeId } = req.body;
    try {
        const entry = new Attendance({
            employee: employeeId,
            checkIn: new Date(),
            status: 'Present'
        });
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

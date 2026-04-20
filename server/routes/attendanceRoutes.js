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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingRecord = await Attendance.findOne({
            employee: employeeId,
            createdAt: { $gte: today }
        });

        if (existingRecord) {
            return res.status(400).json({ message: 'Already checked in for today' });
        }

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

router.post('/check-out', async (req, res) => {
    const { employeeId } = req.body;
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const record = await Attendance.findOne({
            employee: employeeId,
            createdAt: { $gte: today }
        }).sort({ createdAt: -1 });

        if (!record) {
            return res.status(404).json({ message: 'No check-in record found for today' });
        }

        if (record.checkOut) {
            return res.status(400).json({ message: 'Already checked out for today' });
        }

        record.checkOut = new Date();
        await record.save();
        res.status(200).json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get today's attendance status for an employee
router.get('/status/:employeeId', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const record = await Attendance.findOne({
            employee: req.params.employeeId,
            createdAt: { $gte: today }
        }).sort({ createdAt: -1 });

        res.json(record);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

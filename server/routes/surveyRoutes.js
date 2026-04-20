const express = require('express');
const router = express.Router();
const NPSSurvey = require('../models/NPSSurvey');

router.post('/submit', async (req, res) => {
    try {
        const { employeeId, score, feedback } = req.body;
        
        // One survey per employee per month roughly, but let's just allow it for now
        const survey = new NPSSurvey({
            employee: employeeId,
            score,
            feedback
        });

        await survey.save();
        res.status(201).json(survey);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

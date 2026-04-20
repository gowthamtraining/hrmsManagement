const express = require('express');
const router = express.Router();
const { analyzeResume, generateInterviewQuestions, generateDashboardSummary } = require('../services/aiService');

const ResumeAnalysis = require('../models/ResumeAnalysis');

router.post('/analyze-resume', async (req, res) => {
    const { resumeText, jobDescription } = req.body;
    console.log("Route: /analyze-resume triggered");
    try {
        const analysis = await analyzeResume(resumeText, jobDescription);
        
        await ResumeAnalysis.create({
            resumeText,
            jobDescription,
            score: analysis.score,
            summary: analysis.summary
        });

        res.json(analysis);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/generate-questions', async (req, res) => {
    const { role, level } = req.body;
    try {
        const questions = await generateInterviewQuestions(role, level);
        res.json({ questions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/dashboard-summary', async (req, res) => {
    const { stats } = req.body;
    try {
        const summary = await generateDashboardSummary(stats);
        res.json({ summary });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

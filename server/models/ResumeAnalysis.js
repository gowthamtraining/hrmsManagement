const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    resumeText: { type: String, required: true },
    jobDescription: { type: String },
    score: { type: Number },
    summary: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ResumeAnalysis', schema);

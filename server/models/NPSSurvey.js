const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    score: { type: Number, required: true, min: 0, max: 10 },
    feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('NPSSurvey', schema);

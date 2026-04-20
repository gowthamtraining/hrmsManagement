const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    department: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('JobPosting', schema);

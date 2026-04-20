const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true },
    dateOfJoining: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'On Leave', 'Terminated'], default: 'Active' },
    performanceScore: { type: Number, default: 0 },
    resumeUrl: { type: String },
    aiFeedback: { type: String },
    password: { type: String },
    role: { type: String, enum: ['HR', 'Employee'], default: 'Employee' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);

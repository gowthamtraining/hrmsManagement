const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: String, required: true }, // e.g. "April 2026"
    baseSalary: { type: Number, required: true },
    netPay: { type: Number, required: true },
    daysPresent: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', schema);

const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single employee
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new employee
router.post('/', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update employee
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedEmployee) {
            return res.status(404).json({ message: `Employee with id ${id} not found` });
        }
        res.json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

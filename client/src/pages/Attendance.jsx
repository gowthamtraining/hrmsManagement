import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [empRes, attRes] = await Promise.all([
                axios.get('http://localhost:5000/api/employees'),
                axios.get('http://localhost:5000/api/attendance')
            ]);
            setEmployees(empRes.data);
            setRecords(attRes.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleCheckIn = async (employeeId) => {
        try {
            await axios.post('http://localhost:5000/api/attendance/check-in', { employeeId });
            fetchData(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.message || 'Error checking in');
        }
    };

    const isCheckedInToday = (employeeId) => {
        const today = new Date().toISOString().split('T')[0];
        return records.some(r => 
            r.employee?._id === employeeId && 
            new Date(r.createdAt || r.date).toISOString().split('T')[0] === today
        );
    };

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-10">
                <h1 className="mb-2">Daily <span className="gradient-text">Attendance</span></h1>
                <p className="text-text-secondary font-medium">Track and manage employee check-ins effectively.</p>
            </header>

            <div className="card">
                <div className="table-container">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Status Today</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => {
                                const checkedIn = isCheckedInToday(emp._id);
                                return (
                                    <tr key={emp._id} className="hover:bg-white/[0.02] transition">
                                        <td className="font-bold align-middle">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 font-bold">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                {emp.name}
                                            </div>
                                        </td>
                                        <td className="text-text-secondary align-middle">{emp.department}</td>
                                        <td className="align-middle">
                                            {checkedIn ? (
                                                <span className="badge badge-success flex items-center w-max gap-2">
                                                    <CheckCircle size={14} /> Present
                                                </span>
                                            ) : (
                                                <span className="badge badge-warning flex items-center w-max gap-2">
                                                    <Clock size={14} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-right align-middle">
                                            <button 
                                                onClick={() => handleCheckIn(emp._id)}
                                                disabled={checkedIn}
                                                className={`btn py-2 px-4 text-xs ${checkedIn ? 'bg-white/5 text-text-muted cursor-not-allowed border-none' : 'btn-primary'}`}
                                            >
                                                {checkedIn ? 'Checked In' : 'Mark Present'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;

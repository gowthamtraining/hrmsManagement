import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
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
                axios.get(`${API_BASE_URL}/employees`),
                axios.get(`${API_BASE_URL}/attendance`)
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
            await axios.post(`${API_BASE_URL}/attendance/check-in`, { employeeId });
            fetchData(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.message || 'Error checking in');
        }
    };

    const getTodayRecord = (employeeId) => {
        const today = new Date().toISOString().split('T')[0];
        return records.find(r => 
            r.employee?._id === employeeId && 
            new Date(r.createdAt || r.date).toISOString().split('T')[0] === today
        );
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <header className="mb-12">
                <h1 className="text-4xl font-black mb-3">Daily <span className="gradient-text">Attendance</span></h1>
                <p className="text-text-secondary font-medium text-lg">Real-time workforce activity and shift status.</p>
            </header>
 
            <div className="card overflow-hidden">
                <div className="table-container">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02]">
                                <th className="py-6 px-8">Employee</th>
                                <th className="py-6 px-8">Team</th>
                                <th className="py-6 px-8">Check In</th>
                                <th className="py-6 px-8">Check Out</th>
                                <th className="py-6 px-8">Status</th>
                                <th className="py-6 px-8 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {employees.map(emp => {
                                const record = getTodayRecord(emp._id);
                                return (
                                    <tr key={emp._id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="py-6 px-8 align-middle">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mr-4 font-bold text-lg shadow-inner">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-base leading-tight">{emp.name}</div>
                                                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">ID: #{emp._id.slice(-4)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 align-middle">
                                            <span className="text-xs font-bold text-text-secondary bg-white/5 py-1.5 px-3 rounded-lg border border-white/5 uppercase tracking-wider">
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 align-middle font-mono text-sm text-text-secondary">
                                            {record?.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (
                                                <span className="opacity-20">--:--</span>
                                            )}
                                        </td>
                                        <td className="py-6 px-8 align-middle font-mono text-sm text-text-secondary">
                                            {record?.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (
                                                <span className="opacity-20">--:--</span>
                                            )}
                                        </td>
                                        <td className="py-6 px-8 align-middle">
                                            {record ? (
                                                <div className={`flex items-center gap-2 font-bold text-xs ${record.checkOut ? 'text-secondary' : 'text-primary'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${record.checkOut ? 'bg-secondary' : 'bg-primary animate-pulse'}`}></div>
                                                    {record.checkOut ? 'SHIFT DONE' : 'ON CLOCK'}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 font-bold text-xs text-text-muted">
                                                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                                    NOT STARTED
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-6 px-8 text-right align-middle">
                                            {!record && (
                                                <button 
                                                    onClick={() => handleCheckIn(emp._id)}
                                                    className="btn btn-primary py-2 px-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                                                >
                                                    Mark Present
                                                </button>
                                            )}
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, FileText, Loader2, Sparkles, AlertCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

const Payroll = () => {
    const [employees, setEmployees] = useState([]);
    const [payrollData, setPayrollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [calcLoading, setCalcLoading] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/employees`)
            .then(res => {
                setEmployees(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const calculatePayroll = async (id) => {
        setCalcLoading(id);
        try {
            const res = await axios.get(`${API_BASE_URL}/payroll/calculate/${id}`);
            setPayrollData(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Error calculating payroll');
        }
        setCalcLoading(false);
    };

    const handleDisburse = async () => {
        if (!payrollData) return;
        setCalcLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/payroll/disburse`, {
                employeeId: payrollData.employeeId,
                month: payrollData.month,
                baseSalary: payrollData.baseSalary,
                netPay: payrollData.netPay,
                daysPresent: payrollData.daysPresent
            });
            alert('Salary disbursed successfully!');
            setPayrollData(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Error disbursing payment');
        }
        setCalcLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <header className="mb-10">
                <h1 className="mb-2">Automated <span className="gradient-text">Payroll</span></h1>
                <p className="text-text-secondary font-medium">Instantly calculate net pay based on current attendance records.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/20 rounded-2xl text-primary shadow-inner">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight leading-none mb-1">Select Employee</h3>
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Active Payroll Directory</p>
                                </div>
                            </div>
                            <div className="relative group w-full md:w-auto">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search size={18} className="text-text-muted transition-colors group-focus-within:text-primary" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Identify professional..." 
                                    className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-medium focus:bg-white/[0.08] focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {employees.map(emp => (
                                <div key={emp._id} className="group flex items-center justify-between p-5 border border-white/5 rounded-3xl hover:bg-white/[0.03] hover:border-primary/30 transition-all duration-300">
                                    <div className="flex items-center gap-5 w-full">
                                        <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-white/5 flex items-center justify-center font-black text-text-secondary group-hover:bg-primary/20 group-hover:text-primary group-hover:scale-110 transition-all duration-300 shadow-inner overflow-hidden">
                                            {emp.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-extrabold text-white text-lg tracking-tight mb-1">{emp.name}</p>
                                            <span className="inline-block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                {emp.position}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 ml-4">
                                        <button 
                                            onClick={() => calculatePayroll(emp._id)}
                                            className="btn btn-primary py-2.5 px-6 text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                            disabled={calcLoading === emp._id}
                                        >
                                            {calcLoading === emp._id ? <Loader2 className="animate-spin" size={14} /> : 'PROCESS'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {employees.length === 0 && !loading && (
                                <div className="p-12 text-center text-text-secondary border-2 border-dashed border-white/5 rounded-3xl">
                                    <AlertCircle className="mx-auto mb-4 opacity-50" size={40} />
                                    <p className="font-medium text-lg mb-1">No employees found</p>
                                    <p className="text-sm opacity-50">Ensure you have added employees to the directory.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="card h-full relative overflow-hidden bg-primary/5 border-primary/20 min-h-[500px]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full point-events-none translate-x-1/2 -translate-y-1/2"></div>
                        
                        <div className="flex items-center gap-3 mb-10 relative z-10">
                            <div className="p-3 bg-white/10 rounded-2xl text-primary border border-white/5 shadow-xl">
                                <FileText size={20} />
                            </div>
                            <h3 className="text-xl font-bold">Calculation Summary</h3>
                        </div>
                        
                        {payrollData ? (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
                                <div className="bg-bg-main/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mb-8 shadow-2xl">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Employee Details</p>
                                            <p className="text-2xl font-black">{payrollData.employee}</p>
                                        </div>
                                        <div className="px-3 py-1.5 bg-primary/20 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest">
                                            {payrollData.month}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-6 mb-10">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Base Salary</span>
                                            <p className="text-xl font-bold text-white">${Number(payrollData.baseSalary).toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Attendance Status</span>
                                            <p className="text-xl font-bold text-[#34d399] tracking-tight">{payrollData.daysPresent || 0} / 22 <span className="text-[10px] text-text-secondary">Days</span></p>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Total Net Payable</p>
                                            <p className="text-4xl font-black text-white drop-shadow-lg">${Number(payrollData.netPay).toLocaleString()}</p>
                                        </div>
                                        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                            <Sparkles size={24} />
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleDisburse} 
                                    className="btn btn-primary w-full py-5 text-base shadow-xl shadow-primary/20"
                                    disabled={calcLoading === true}
                                >
                                    {calcLoading === true ? <Loader2 className="animate-spin mr-2" /> : <Sparkles size={20} className="mr-2" />}
                                    {calcLoading === true ? 'Disbursing...' : 'Disburse Approved Payment'}
                                </button>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-center p-10 relative z-10">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5 opacity-50">
                                    <FileText size={32} className="text-text-secondary" />
                                </div>
                                <p className="text-lg font-bold text-white mb-2 opacity-80">Pending Calculation</p>
                                <p className="text-sm text-text-secondary max-w-[240px] leading-relaxed">Select an active employee from the list to begin the automated payroll process.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payroll;

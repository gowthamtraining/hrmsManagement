import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, FileText, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Payroll = () => {
    const [employees, setEmployees] = useState([]);
    const [payrollData, setPayrollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [calcLoading, setCalcLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/employees')
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
            const res = await axios.get(`http://localhost:5000/api/payroll/calculate/${id}`);
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
            await axios.post('http://localhost:5000/api/payroll/disburse', {
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card">
                    <h3 className="mb-6 font-bold flex items-center">
                        <DollarSign size={20} className="text-primary mr-2" /> Select Employee
                    </h3>
                    <div className="space-y-4">
                        {employees.map(emp => (
                            <div key={emp._id} className="flex items-center justify-between p-4 border border-border-color rounded-2xl hover:border-primary/30 transition bg-white/[0.01]">
                                <div>
                                    <p className="font-bold text-lg">{emp.name}</p>
                                    <p className="text-sm text-text-secondary">{emp.position}</p>
                                </div>
                                <button 
                                    onClick={() => calculatePayroll(emp._id)}
                                    className="btn btn-outline border-primary/50 text-primary hover:bg-primary/10"
                                    disabled={calcLoading === emp._id}
                                >
                                    {calcLoading === emp._id ? <Loader2 className="animate-spin" size={18} /> : 'Process Salary'}
                                </button>
                            </div>
                        ))}
                        {employees.length === 0 && !loading && (
                            <div className="p-8 text-center text-text-secondary border border-dashed border-border-color rounded-2xl">
                                <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                                <p>No employees found in the directory.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1 border border-primary/20 rounded-2xl p-6 bg-primary/5 relative overflow-hidden h-fit sticky top-[120px]">
                    <div className="absolute top-0 right-0 p-10 bg-primary/20 blur-[60px] rounded-full point-events-none"></div>
                    <h3 className="mb-6 font-bold flex items-center z-10 relative">
                        <FileText size={20} className="text-primary mr-2" /> Salary Slip
                    </h3>
                    
                    {payrollData ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="z-10 relative">
                            <div className="bg-bg-card p-6 rounded-2xl border border-white/5 mb-6 shadow-xl">
                                <p className="text-sm text-text-secondary mb-1">Employee</p>
                                <p className="text-xl font-bold mb-6">{payrollData.employee}</p>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-white/5 pb-4">
                                        <span className="text-text-secondary">Pay Period</span>
                                        <span className="font-medium">{payrollData.month}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-4">
                                        <span className="text-text-secondary">Base Salary</span>
                                        <span className="font-medium">${Number(payrollData.baseSalary).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-4">
                                        <span className="text-text-secondary">Days Present</span>
                                        <span className="font-medium text-success">{payrollData.daysPresent || 0} / 22</span>
                                    </div>
                                </div>
                                
                                <div className="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/20 flex justify-between items-center">
                                    <span className="font-bold text-primary">Net Pay</span>
                                    <span className="text-2xl font-black text-white">${Number(payrollData.netPay).toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleDisburse} 
                                className="btn btn-primary w-full shadow-lg"
                                disabled={calcLoading === true}
                            >
                                <Sparkles size={18} className="mr-2" /> {calcLoading === true ? 'Processing...' : 'Disburse Payment'}
                            </button>
                        </motion.div>
                    ) : (
                        <div className="text-center p-10 text-text-secondary opacity-50 z-10 relative">
                            <FileText size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Generate a payroll calculation to view the slip here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payroll;

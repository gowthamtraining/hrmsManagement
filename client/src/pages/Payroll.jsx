import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, FileText, Loader2, Sparkles, AlertCircle, Search } from 'lucide-react';
import API_BASE_URL from '../config';

const Payroll = () => {
    const [employees, setEmployees] = useState([]);
    const [payrollData, setPayrollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [calcLoading, setCalcLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get(`${API_BASE_URL}/employees`)
            .then(res => { setEmployees(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const rowHover = (e, enter) => {
        e.currentTarget.style.borderColor = enter ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)';
        e.currentTarget.style.background = enter ? 'rgba(255,255,255,0.02)' : 'transparent';
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Automated <span className="gradient-text">Payroll</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Calculate net pay based on real-time attendance records.</p>
            </header>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                {/* Employee List */}
                <div className="card" style={{ flex: '1 1 340px', minWidth: 0 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{ padding: '0.625rem', background: 'rgba(99,102,241,0.18)', borderRadius: '0.875rem', color: '#818cf8', lineHeight: 0, flexShrink: 0 }}>
                                <DollarSign size={22} />
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.1rem' }}>Select Employee</h3>
                                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(148,163,184,0.55)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Active Payroll Directory</p>
                            </div>
                        </div>
                        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '260px', minWidth: '140px' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '0.875rem', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.4)', lineHeight: 0, pointerEvents: 'none' }}>
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search employee..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '2.5rem', paddingTop: '0.625rem', paddingBottom: '0.625rem', fontSize: '0.85rem', borderRadius: '0.875rem', background: 'rgba(255,255,255,0.04)' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {filteredEmployees.map(emp => (
                            <div
                                key={emp._id}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', transition: 'all 0.2s', gap: '0.75rem' }}
                                onMouseEnter={e => rowHover(e, true)}
                                onMouseLeave={e => rowHover(e, false)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1, minWidth: 0 }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '0.875rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.15))', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>
                                        {emp.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.2rem' }}>{emp.name}</p>
                                        <span style={{ fontSize: '0.63rem', fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.5rem', borderRadius: '0.35rem', border: '1px solid rgba(255,255,255,0.06)', display: 'inline-block' }}>
                                            {emp.position}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => calculatePayroll(emp._id)}
                                    disabled={calcLoading === emp._id}
                                    className="btn btn-primary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}
                                >
                                    {calcLoading === emp._id ? <Loader2 className="animate-spin" size={13} /> : 'PROCESS'}
                                </button>
                            </div>
                        ))}
                        {filteredEmployees.length === 0 && !loading && (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', border: '2px dashed rgba(255,255,255,0.06)', borderRadius: '1.25rem' }}>
                                <AlertCircle style={{ margin: '0 auto 1rem', opacity: 0.4, display: 'block' }} size={36} />
                                <p style={{ fontWeight: 600 }}>No employees found</p>
                                <p style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '0.25rem' }}>Add employees to the directory first.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payroll Summary Panel */}
                <div className="card" style={{ flex: '1 1 300px', minWidth: 0, minHeight: '420px', background: 'rgba(99,102,241,0.04)', borderColor: 'rgba(99,102,241,0.15)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '220px', height: '220px', background: 'rgba(99,102,241,0.12)', borderRadius: '50%', filter: 'blur(70px)', pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ padding: '0.625rem', background: 'rgba(255,255,255,0.07)', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.08)', lineHeight: 0, flexShrink: 0 }}>
                            <FileText size={20} color="#818cf8" />
                        </div>
                        <h3 style={{ fontWeight: 700 }}>Calculation Summary</h3>
                    </div>

                    {payrollData ? (
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ background: 'rgba(2,6,23,0.45)', backdropFilter: 'blur(16px)', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.63rem', fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>Employee</p>
                                        <p style={{ fontSize: '1.3rem', fontWeight: 900 }}>{payrollData.employee}</p>
                                    </div>
                                    <div style={{ padding: '0.3rem 0.75rem', background: 'rgba(99,102,241,0.18)', borderRadius: '0.5rem', color: '#818cf8', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', alignSelf: 'flex-start' }}>
                                        {payrollData.month}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.63rem', fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Base Salary</span>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>${Number(payrollData.baseSalary).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.63rem', fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Attendance</span>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                                            {payrollData.daysPresent || 0}
                                            <span style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,0.5)', fontWeight: 600 }}> / 22d</span>
                                        </p>
                                    </div>
                                </div>

                                <div style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '0.63rem', fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Net Payable</p>
                                        <p style={{ fontSize: '2.25rem', fontWeight: 900, lineHeight: 1 }}>${Number(payrollData.netPay).toLocaleString()}</p>
                                    </div>
                                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Sparkles size={22} color="#34d399" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleDisburse}
                                disabled={calcLoading === true}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', fontSize: '0.95rem', fontWeight: 800, borderRadius: '1rem' }}
                            >
                                {calcLoading === true
                                    ? <><Loader2 className="animate-spin" size={18} style={{ marginRight: '0.5rem' }} /> Disbursing...</>
                                    : <><Sparkles size={18} style={{ marginRight: '0.5rem' }} /> Disburse Payment</>
                                }
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '72px', height: '72px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <FileText size={30} color="rgba(148,163,184,0.25)" />
                            </div>
                            <p style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'rgba(255,255,255,0.65)' }}>Awaiting Selection</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '200px', lineHeight: 1.65 }}>Select an employee from the directory to begin payroll processing.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payroll;

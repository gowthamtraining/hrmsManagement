import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Clock, CheckCircle, FileDown, History } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import API_BASE_URL from '../config';

const EmployeePortal = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attendanceRecord, setAttendanceRecord] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchHistory();
            fetchAttendanceStatus();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/payroll/history/${user.id}`);
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const fetchAttendanceStatus = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/attendance/status/${user.id}`);
            setAttendanceRecord(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckIn = async () => {
        try {
            await axios.post(`${API_BASE_URL}/attendance/check-in`, { employeeId: user.id });
            fetchAttendanceStatus();
            alert('Checked in successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error checking in');
        }
    };

    const handleCheckOut = async () => {
        try {
            await axios.post(`${API_BASE_URL}/attendance/check-out`, { employeeId: user.id });
            fetchAttendanceStatus();
            alert('Checked out successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error checking out');
        }
    };

    const downloadPDF = (slip) => {
        try {
            const doc = new jsPDF();

            // Header
            doc.setFillColor(99, 102, 241);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text('SALARY SLIP', 105, 25, { align: 'center' });

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.text(`Employee Name: ${user.name || 'Employee'}`, 20, 60);
            doc.text(`Pay Period: ${slip.month}`, 20, 70);
            doc.text(`Disbursement Date: ${new Date(slip.createdAt).toLocaleDateString()}`, 20, 80);

            // Data Table
            const tableColumn = ["Description", "Amount"];
            const tableRows = [
                ["Base Monthly Salary", `$${Number(slip.baseSalary).toLocaleString()}`],
                ["Attendance Multiplier", `${slip.daysPresent} / 22 Days`],
                ["Net Payable Amount", `$${Number(slip.netPay).toLocaleString()}`],
            ];

            autoTable(doc, {
                startY: 100,
                head: [tableColumn],
                body: tableRows,
                theme: 'striped',
                headStyles: { fillColor: [99, 102, 241] }
            });

            // Footer
            const finalY = (doc).lastAutoTable.finalY || 150;
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text('This is a computer generated document. No signature required.', 105, finalY + 30, { align: 'center' });

            doc.save(`Payslip_${slip.month.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("PDF Generation error:", error);
            alert("Faied to generate PDF. Please try again.");
        }
    };

    const [npsScore, setNpsScore] = useState(null);
    const [surveySubmitted, setSurveySubmitted] = useState(false);

    const submitNPS = async (score) => {
        try {
            await axios.post(`${API_BASE_URL}/surveys/submit`, {
                employeeId: user.id,
                score
            });
            setSurveySubmitted(true);
            setNpsScore(score);
            alert("Thanks for your feedback!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ width: '100%', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ marginBottom: '0.4rem' }}>
                    Welcome, <span className="gradient-text">{user?.name}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Employee Self-Service Portal</p>
            </header>

            {/* Top Row: Shift Log + Latest Disbursement */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Shift Log */}
                <div className="card" style={{ flex: '1 1 260px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.625rem', background: 'rgba(99,102,241,0.18)', borderRadius: '0.875rem', lineHeight: 0, flexShrink: 0 }}>
                            <Clock size={22} color="#818cf8" />
                        </div>
                        <h3 style={{ fontWeight: 700 }}>Shift Log</h3>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(148,163,184,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
                            Current Status
                        </p>
                        <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                            {attendanceRecord
                                ? (attendanceRecord.checkOut ? 'Shift Completed' : 'Currently On Clock')
                                : 'Awaiting Check-in'}
                        </p>
                        {attendanceRecord?.checkIn && !attendanceRecord.checkOut && (
                            <p style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block', flexShrink: 0 }} />
                                Started at {new Date(attendanceRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}
                    </div>

                    {!attendanceRecord ? (
                        <button onClick={handleCheckIn} className="btn btn-primary" style={{ width: '100%' }}>
                            <CheckCircle size={18} style={{ marginRight: '0.5rem' }} /> Mark Present
                        </button>
                    ) : !attendanceRecord.checkOut ? (
                        <button onClick={handleCheckOut} className="btn" style={{ width: '100%', background: '#f59e0b', color: '#fff', border: 'none', boxShadow: '0 4px 15px rgba(245,158,11,0.3)' }}>
                            <Clock size={18} style={{ marginRight: '0.5rem' }} /> End Shift
                        </button>
                    ) : (
                        <div style={{ padding: '0.875rem', background: 'rgba(16,185,129,0.1)', borderRadius: '0.875rem', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', textAlign: 'center', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={18} /> Daily Goal Met
                        </div>
                    )}
                </div>

                {/* Latest Disbursement */}
                <div className="card" style={{ flex: '2 1 340px', minWidth: 0, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '160px', height: '160px', background: 'rgba(16,185,129,0.08)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '0.625rem', background: 'rgba(16,185,129,0.18)', borderRadius: '0.875rem', lineHeight: 0, flexShrink: 0 }}>
                                <FileDown size={22} color="#34d399" />
                            </div>
                            <h3 style={{ fontWeight: 700 }}>Latest Disbursement</h3>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, lineHeight: 1, marginBottom: '0.5rem' }}>
                                    {history.length > 0 ? `$${history[0].netPay.toLocaleString()}` : '$0.00'}
                                </p>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(148,163,184,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                    {history.length > 0
                                        ? `Credited for ${history[0].month} · ${new Date(history[0].createdAt).toLocaleDateString()}`
                                        : 'No disbursement data available'}
                                </p>
                            </div>
                            {history.length > 0 && (
                                <button onClick={() => downloadPDF(history[0])} className="btn btn-outline" style={{ flexShrink: 0 }}>
                                    <FileDown size={18} style={{ marginRight: '0.5rem' }} /> Download Slip
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* NPS Survey */}
            <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(99,102,241,0.03)', borderStyle: 'dashed', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(99,102,241,0.04)', filter: 'blur(60px)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', position: 'relative', zIndex: 1 }}>
                    <div>
                        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Rate your work environment</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', lineHeight: 1.6 }}>Your pulse helps us fine-tune the workspace for maximum comfort.</p>
                    </div>
                    {surveySubmitted ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(16,185,129,0.1)', padding: '1.25rem 2rem', borderRadius: '1.25rem', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <CheckCircle size={36} color="#34d399" style={{ marginBottom: '0.75rem' }} />
                            <span style={{ fontWeight: 700, color: '#34d399' }}>Thanks! You rated us {npsScore}/10</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                            {[...Array(11).keys()].map(n => (
                                <button
                                    key={n}
                                    onClick={() => submitNPS(n)}
                                    style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.target.style.background = '#6366f1'; e.target.style.borderColor = '#6366f1'; e.target.style.transform = 'scale(1.12)'; }}
                                    onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.transform = 'scale(1)'; }}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="flex items-center mb-6">
                    <History className="text-primary mr-2" size={24} />
                    <h3 className="text-xl font-bold">Payment History</h3>
                </div>

                <div className="table-container">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Base Salary</th>
                                <th>Net Pay</th>
                                <th>Status</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(slip => (
                                <tr key={slip._id} className="hover:bg-white/[0.02]">
                                    <td className="font-bold">{slip.month}</td>
                                    <td className="text-text-secondary">${slip.baseSalary.toLocaleString()}</td>
                                    <td className="font-medium text-white">${slip.netPay.toLocaleString()}</td>
                                    <td>
                                        <span className="badge badge-success">Paid</span>
                                    </td>
                                    <td className="text-right">
                                        <button onClick={() => downloadPDF(slip)} className="btn btn-outline py-2 px-3 text-xs border-primary/20 text-primary hover:bg-primary/5">
                                            <FileDown size={14} className="mr-2" /> PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-text-secondary opacity-50">
                                        No payslips available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeePortal;

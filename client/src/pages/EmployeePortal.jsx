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
        <div className="w-full pb-20">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold mb-1">Welcome, <span className="gradient-text">{user?.name}</span></h1>
                <p className="text-text-secondary font-medium">Employee Self-Service Portal</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card md:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Shift Log</h3>
                    </div>
                    
                    <div className="mb-6">
                        <p className="text-text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Current Status</p>
                        <p className="text-lg font-bold">
                            {attendanceRecord 
                                ? (attendanceRecord.checkOut ? "Shift Completed" : "Currently On Clock") 
                                : "Awaiting Check-in"}
                        </p>
                        {attendanceRecord?.checkIn && !attendanceRecord.checkOut && (
                            <p className="text-xs text-secondary mt-1 font-semibold flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                                Started at {new Date(attendanceRecord.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                        )}
                    </div>
                    
                    {!attendanceRecord ? (
                        <button onClick={handleCheckIn} className="btn btn-primary w-full shadow-lg shadow-primary/20">
                            <CheckCircle size={18} className="mr-2" /> Mark Present
                        </button>
                    ) : !attendanceRecord.checkOut ? (
                        <button onClick={handleCheckOut} className="btn bg-amber-500 hover:bg-amber-600 border-none text-white w-full shadow-lg shadow-amber-500/20">
                            <Clock size={18} className="mr-2" /> End Shift
                        </button>
                    ) : (
                        <div className="p-4 bg-secondary/10 rounded-2xl border border-secondary/20 text-secondary text-center font-bold flex items-center justify-center gap-2">
                             <CheckCircle size={18} /> Daily Goal Met
                        </div>
                    )}
                </div>

                <div className="card md:col-span-2 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-secondary/20 rounded-2xl text-secondary">
                                <FileDown size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Latest Disbursement</h3>
                        </div>
                        
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-4xl font-black mb-2">
                                    {history.length > 0 ? `$${history[0].netPay.toLocaleString()}` : '$0.00'}
                                </p>
                                <p className="text-text-secondary font-semibold uppercase tracking-widest text-[10px]">
                                    {history.length > 0 ? `Credited for ${history[0].month} • ${new Date(history[0].createdAt).toLocaleDateString()}` : 'No disbursement data available'}
                                </p>
                            </div>
                            {history.length > 0 && (
                                <button onClick={() => downloadPDF(history[0])} className="btn btn-outline border-white/10 hover:bg-white/5 py-4 px-6 text-sm">
                                    <FileDown size={18} className="mr-2" /> Download Slip
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-8 p-10 bg-white/5 border-dashed relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none"></div>
                <div className="flex flex-col xl:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="text-center xl:text-left">
                        <h3 className="text-2xl font-bold mb-3">Rate your work environment</h3>
                        <p className="text-text-secondary max-w-md">Your pulse helps us tweak the workspace for maximum creativity and comfort.</p>
                    </div>
                    {surveySubmitted ? (
                        <div className="flex flex-col items-center bg-secondary/10 px-10 py-6 rounded-3xl border border-secondary/20">
                            <CheckCircle size={40} className="text-secondary mb-4" />
                            <span className="font-bold text-lg text-secondary">Thanks! You rated us {npsScore}/10</span>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-3">
                            {[...Array(11).keys()].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => submitNPS(n)}
                                    className="w-12 h-12 rounded-full border border-white/10 hover:bg-primary hover:border-primary hover:text-white transition-all text-sm font-bold flex items-center justify-center bg-white/5 hover:scale-110 active:scale-95 shadow-md"
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

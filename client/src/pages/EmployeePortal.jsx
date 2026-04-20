import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Clock, CheckCircle, FileDown, History } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const EmployeePortal = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (user?.id) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/payroll/history/${user.id}`);
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleCheckIn = async () => {
        try {
            await axios.post('http://localhost:5000/api/attendance/check-in', { employeeId: user.id });
            alert('Checked in successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error checking in');
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
            await axios.post('http://localhost:5000/api/surveys/submit', {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card">
                    <div className="flex items-center mb-4">
                        <Clock className="text-primary mr-2" size={24} />
                        <h3 className="text-xl font-bold">Daily Attendance</h3>
                    </div>
                    <p className="text-text-secondary mb-6 text-sm">Mark your attendance for today.</p>
                    <button onClick={handleCheckIn} className="btn btn-primary w-full justify-center">
                        <CheckCircle size={18} className="mr-2" /> Mark Present
                    </button>
                </div>

                <div className="card text-center flex flex-col justify-center items-center py-10" style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <h3 className="text-text-muted mb-2 font-bold">Latest Disbursement</h3>
                    <p className="text-2xl font-bold text-white mb-2">
                        {history.length > 0 ? `$${history[0].netPay.toLocaleString()}` : '$0.00'}
                    </p>
                    <p className="text-xs text-text-secondary">
                        {history.length > 0 ? `For ${history[0].month}` : 'No recent payments found.'}
                    </p>
                </div>
            </div>

            <div className="card mb-8 p-8" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">How likely are you to recommend working here?</h3>
                        <p className="text-text-secondary text-sm">Your feedback helps us improve the workplace.</p>
                    </div>
                    {surveySubmitted ? (
                        <div className="flex items-center bg-success/20 px-6 py-3 rounded-2xl border border-success/30">
                            <CheckCircle size={20} className="text-success mr-3" />
                            <span className="font-bold text-success">Score of {npsScore} Submitted</span>
                        </div>
                    ) : (
                        <div className="flex gap-1">
                            {[...Array(11).keys()].map((n) => (
                                <button 
                                    key={n} 
                                    onClick={() => submitNPS(n)}
                                    className="w-8 h-8 rounded-lg border border-white/10 hover:bg-primary hover:text-white transition-all text-xs font-bold"
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Plus, Search, Edit2, Trash2, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmpId, setEditingEmpId] = useState(null);
    const [newEmp, setNewEmp] = useState({ name: '', position: '', department: '', status: 'Active', email: '', salary: '' });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/employees`);
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEmpId) {
                const res = await axios.put(`${API_BASE_URL}/employees/${editingEmpId}`, {
                    ...newEmp,
                    salary: Number(newEmp.salary)
                });
                setEmployees(employees.map(emp => emp._id === editingEmpId ? res.data : emp));
            } else {
                const res = await axios.post(`${API_BASE_URL}/employees`, {
                    ...newEmp,
                    salary: Number(newEmp.salary)
                });
                setEmployees([res.data, ...employees]);
            }
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || "Error processing request");
        }
    };

    const handleEdit = (emp) => {
        setEditingEmpId(emp._id);
        setNewEmp({
            name: emp.name,
            position: emp.position,
            department: emp.department,
            status: emp.status,
            email: emp.email,
            salary: emp.salary
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/employees/${id}`);
            setEmployees(employees.filter(emp => emp._id !== id));
        } catch (err) {
            alert("Error deleting employee");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEmpId(null);
        setNewEmp({ name: '', position: '', department: '', status: 'Active', email: '', salary: '' });
    };

    const dummyData = [
        { name: 'Marcus Sterling', position: 'Head of Engineering', department: 'Development', status: 'Active', email: 'marcus@ai-hrms.com' },
        { name: 'Sarah Chen', position: 'Lead UI/UX Designer', department: 'Design', status: 'Active', email: 'sarah.c@ai-hrms.com' },
        { name: 'David Miller', position: 'Talent Acquisition', department: 'HR & People', status: 'On Leave', email: 'david.m@ai-hrms.com' },
        { name: 'Elena Rodriguez', position: 'Backend specialist', department: 'Development', status: 'Active', email: 'elena@ai-hrms.com' }
    ];

    const displayData = employees.length > 0 ? employees : dummyData;

    const handleExport = () => {
        if (employees.length === 0) return alert("No employee data available to export.");
        
        const headers = ["Name", "Email", "Position", "Department", "Status", "Salary"];
        const csvRows = [
            headers.join(","),
            ...employees.map(emp => [
                `"${emp.name.replace(/"/g, '""')}"`,
                `"${emp.email.replace(/"/g, '""')}"`,
                `"${emp.position.replace(/"/g, '""')}"`,
                `"${emp.department.replace(/"/g, '""')}"`,
                `"${emp.status}"`,
                emp.salary
            ].join(","))
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `HRMS_Employee_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-3">Employee <span className="gradient-text">Directory</span></h1>
                    <p className="text-text-secondary font-bold text-xs uppercase tracking-[0.2em]">Scale your workforce with precision</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="btn btn-outline flex-1 md:flex-none border-white/10" onClick={handleExport}>
                        <Download size={18} className="mr-2" /> Export
                    </button>
                    <button className="btn btn-primary flex-1 md:flex-none shadow-xl shadow-primary/20" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} className="mr-2" /> Add Professional
                    </button>
                </div>
            </div>

            <div className="card !p-0 overflow-visible">
                <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                    <div className="relative max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                            <Search size={22} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Identify professional..." 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-16 pr-6 text-base font-medium focus:bg-white/[0.08] focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02]">
                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Member Details</th>
                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Job Role</th>
                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Department</th>
                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {displayData.map((emp, i) => (
                                <tr key={i} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-black text-primary text-xl border border-primary/10 shadow-inner">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-lg tracking-tight">{emp.name}</div>
                                                <div className="text-xs text-text-secondary font-medium tracking-wide">{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="font-bold text-white/90">{emp.position || emp.role}</div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className="text-[10px] font-black text-text-secondary bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest">
                                            {emp.department || emp.dept}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${emp.status === 'Active' ? 'bg-secondary animate-pulse' : 'bg-accent'}`}></div>
                                            <span className={`text-[11px] font-black uppercase tracking-widest ${emp.status === 'Active' ? 'text-secondary' : 'text-accent'}`}>
                                                {emp.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button 
                                                onClick={() => handleEdit(emp)}
                                                className="p-3 bg-white/5 rounded-xl text-text-secondary hover:bg-primary/20 hover:text-primary transition-all shadow-sm border border-white/5"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(emp._id)}
                                                className="p-3 bg-white/5 rounded-xl text-text-secondary hover:bg-danger/20 hover:text-danger transition-all shadow-sm border border-white/5"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-8 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <span className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">Total Members: {displayData.length}</span>
                    <div className="flex gap-3">
                        <button className="btn btn-outline py-2.5 px-6 text-xs border-white/10 hover:bg-white/5 transition-all">Previous</button>
                        <button className="btn btn-primary py-2.5 px-6 text-xs shadow-lg shadow-primary/10 transition-all">Next Page</button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="modal-content"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-2xl font-bold">{editingEmpId ? 'Update' : 'New'} Employee</h2>
                                    <p className="text-text-secondary text-sm">{editingEmpId ? 'Modify existing' : 'Add a new'} professional</p>
                                </div>
                                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">Member Name</label>
                                    <input required type="text" placeholder="e.g. Jonathan Ive" 
                                        value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">Workspace Email</label>
                                    <input required type="email" placeholder="j.ive@apple.com"
                                        value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">Job Role</label>
                                        <input required type="text" placeholder="Design VP"
                                            value={newEmp.position} onChange={e => setNewEmp({...newEmp, position: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">Salary ($)</label>
                                        <input required type="number" placeholder="85000"
                                            value={newEmp.salary} onChange={e => setNewEmp({...newEmp, salary: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">Squad/Team</label>
                                    <input required type="text" placeholder="Product"
                                        value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})} />
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <button type="button" onClick={closeModal} className="btn btn-outline flex-1">Dismiss</button>
                                    <button type="submit" className="btn btn-primary flex-1">
                                        {editingEmpId ? 'Save Changes' : 'Establish Record'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmployeeList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            const res = await axios.get('http://localhost:5000/api/employees');
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
                const res = await axios.put(`http://localhost:5000/api/employees/${editingEmpId}`, {
                    ...newEmp,
                    salary: Number(newEmp.salary)
                });
                setEmployees(employees.map(emp => emp._id === editingEmpId ? res.data : emp));
            } else {
                const res = await axios.post('http://localhost:5000/api/employees', {
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
            await axios.delete(`http://localhost:5000/api/employees/${id}`);
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
        <div className="w-full">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="mb-2">Employee <span className="gradient-text">Directory</span></h1>
                    <p className="text-text-secondary font-medium uppercase tracking-widest text-[11px]">Global Workforce Management</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-outline" onClick={handleExport}>
                        <Download size={18} className="mr-2" /> Export
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} className="mr-2" /> Add Employee
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div className="p-8 border-b border-border-color bg-white/[0.01]">
                    <div className="relative" style={{ maxWidth: '450px' }}>
                        <Search className="absolute text-text-secondary" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} size={20} />
                        <input type="text" placeholder="Search by name, role or team..." className="w-full" style={{ paddingLeft: '3rem' }} />
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Common Info</th>
                                <th>Position</th>
                                <th>Team</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.map((emp, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                    <td>
                                        <div className="flex items-center">
                                            <div className="avatar">{emp.name.charAt(0)}</div>
                                            <div>
                                                <div className="font-bold text-text-primary text-base">{emp.name}</div>
                                                <div className="text-xs text-text-secondary font-medium">{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-semibold text-text-primary">{emp.position || emp.role}</div>
                                    </td>
                                    <td>
                                        <span className="text-xs font-bold text-text-secondary bg-white/5 px-2 py-1 rounded-md border border-white/5 uppercase tracking-wide">
                                            {emp.department || emp.dept}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${emp.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(emp)}
                                                className="hover:bg-white/5 text-text-secondary hover:text-white transition-all"
                                                style={{ padding: '0.75rem', borderRadius: '0.75rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(emp._id)}
                                                className="hover:bg-red-500/10 text-text-secondary transition-all cursor-pointer"
                                                style={{ padding: '0.75rem', borderRadius: '0.75rem', border: 'none', background: 'transparent', color: 'inherit' }}
                                            >
                                                <Trash2 size={16} color="red" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-6 border-t border-border-color flex justify-between items-center bg-white/[0.01]">
                    <span className="text-xs text-text-secondary font-bold uppercase tracking-widest">Showing {displayData.length} records</span>
                    <div className="flex gap-2">
                        <button className="btn btn-outline py-2 px-4 text-xs">Previous</button>
                        <button className="btn btn-outline py-2 px-4 text-xs">Next</button>
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

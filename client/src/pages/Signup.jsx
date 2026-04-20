import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Employee', department: 'General', position: 'Staff' });
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen w-full" style={{ backgroundColor: '#0a0f1d' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 className="text-3xl font-extrabold mb-6 text-center">Create <span className="gradient-text">Account</span></h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-text-secondary mb-1 text-sm">Name</label>
                            <input type="text" className="w-full" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-text-secondary mb-1 text-sm">Email</label>
                            <input type="email" className="w-full" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-text-secondary mb-1 text-sm">Password</label>
                            <input type="password" className="w-full" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-text-secondary mb-1 text-sm">Role</label>
                            <select 
                                className="w-full" 
                                style={{ backgroundColor: '#0f172a', color: '#fff', padding: '0.9rem 1.1rem', borderRadius: '0.85rem', border: '1px solid var(--border-color)' }}
                                value={formData.role} 
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="Employee" style={{ background: '#0f172a', color: '#fff' }}>Employee (Portal)</option>
                                <option value="HR" style={{ background: '#0f172a', color: '#fff' }}>HR (Admin Dashboard)</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-4 justify-center" style={{ padding: '0.75rem 0' }}>Sign Up</button>
                    <p className="mt-4 text-center text-sm text-text-secondary">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;

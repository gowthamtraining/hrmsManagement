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
        <div className="flex justify-center items-center h-screen w-full relative overflow-hidden bg-[#020617]">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/4"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 translate-x-1/4"></div>

            <div className="card w-full max-w-[550px] relative z-10 border-white/5 backdrop-blur-3xl shadow-2xl">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black mb-2 tracking-tighter">Join the <span className="gradient-text">Network</span></h2>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-[0.2em]">Deploy your professional profile</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Full Identity</label>
                            <input type="text" className="w-full" placeholder="e.g. Marcus Sterling" 
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Secure Email</label>
                            <input type="email" className="w-full" placeholder="name@company.com"
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Access Password</label>
                            <input type="password" className="w-full" placeholder="••••••••"
                                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">System Privilege</label>
                            <select 
                                className="w-full appearance-none bg-[#0f172a] border-white/10"
                                value={formData.role} 
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="Employee">Employee (Member Portal)</option>
                                <option value="HR">HR Admin (Master Control)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full py-4 text-base shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all font-black">
                            INITIALIZE ACCOUNT
                        </button>
                    </div>

                    <p className="text-center text-sm text-text-secondary font-medium">
                        Already established? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen w-full relative overflow-hidden bg-[#020617]">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

            <div className="card w-full max-w-[420px] relative z-10 border-white/5 backdrop-blur-3xl shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-primary/20 group hover:scale-110 transition-transform">
                        <Lock className="text-primary group-hover:scale-110 transition-transform" size={32} />
                    </div>
                    <h2 className="text-4xl font-black mb-2 tracking-tighter">Sign <span className="gradient-text">In</span></h2>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-[0.2em]">Strategic Workforce Management</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Organization Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                            <input 
                                type="email" 
                                className="w-full pl-12 focus:ring-2 focus:ring-primary/20" 
                                placeholder="name@company.com"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-widest mb-2 px-1">Secret Access Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                            <input 
                                type="password" 
                                className="w-full pl-12 focus:ring-2 focus:ring-primary/20"
                                placeholder="••••••••"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-full py-4 text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-black">
                        IDENTIFY & ENTER
                    </button>

                    <div className="pt-4 text-center">
                        <p className="text-sm text-text-secondary font-medium">
                            New member? <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">Request Access</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

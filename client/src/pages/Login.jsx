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
        <div className="flex justify-center items-center h-screen w-full" style={{ backgroundColor: '#0a0f1d' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-3xl font-extrabold mb-6 text-center">Welcome <span className="gradient-text">Back</span></h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-text-secondary mb-2 text-sm">Email</label>
                        <div className="relative">
                            <Mail className="absolute text-text-muted" style={{ left: '1rem', top: '1rem' }} size={18} />
                            <input 
                                type="email" 
                                className="w-full" 
                                style={{ paddingLeft: '2.75rem' }}
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-text-secondary mb-2 text-sm">Password</label>
                        <div className="relative">
                            <Lock className="absolute text-text-muted" style={{ left: '1rem', top: '1rem' }} size={18} />
                            <input 
                                type="password" 
                                className="w-full" 
                                style={{ paddingLeft: '2.75rem' }}
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full justify-center" style={{ padding: '0.75rem 0' }}>Login</button>
                    <p className="mt-4 text-center text-sm text-text-secondary">
                        Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;

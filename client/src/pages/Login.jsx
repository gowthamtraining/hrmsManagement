import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, Zap } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            navigate(user?.role === 'HR' ? '/' : '/my-portal');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(ellipse at 70% 10%, rgba(99,102,241,0.18) 0, transparent 55%), radial-gradient(ellipse at 20% 90%, rgba(16,185,129,0.12) 0, transparent 55%), #020617',
            padding: '1.5rem', position: 'relative', overflow: 'hidden'
        }}>
            {/* Ambient orbs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(16,185,129,0.06)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            <div style={{
                width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1,
                background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2rem',
                padding: 'clamp(1.75rem, 5vw, 2.75rem)',
                boxShadow: '0 32px 64px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '1.25rem',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.15))',
                        border: '1px solid rgba(99,102,241,0.3)', margin: '0 auto 1.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(99,102,241,0.25)'
                    }}>
                        <Lock size={30} color="#818cf8" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '0.4rem' }}>
                        Sign <span style={{ background: 'linear-gradient(135deg, #34d399, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>In</span>
                    </h2>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                        Workforce Intelligence Portal
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: '1.125rem' }}>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'rgba(148,163,184,0.55)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.5)', pointerEvents: 'none', lineHeight: 0 }}>
                                <Mail size={17} />
                            </div>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '1.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'rgba(148,163,184,0.55)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.5)', pointerEvents: 'none', lineHeight: 0 }}>
                                <Lock size={17} />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.08em', borderRadius: '1rem' }}
                    >
                        {loading ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(148,163,184,0.7)' }}>
                    New here?{' '}
                    <Link to="/signup" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none' }}>
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

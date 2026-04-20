import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Employee', department: 'General', position: 'Staff' });
    const [loading, setLoading] = useState(false);
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(formData);
            navigate(formData.role === 'HR' ? '/' : '/my-portal');
        } catch (err) {
            alert(err.response?.data?.message || 'Signup failed. Please try again.');
        }
        setLoading(false);
    };

    const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

    const labelStyle = {
        display: 'block', fontSize: '0.65rem', fontWeight: 800,
        color: 'rgba(148,163,184,0.55)', textTransform: 'uppercase',
        letterSpacing: '0.15em', marginBottom: '0.5rem'
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(ellipse at 30% 10%, rgba(16,185,129,0.12) 0, transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(99,102,241,0.18) 0, transparent 55%), #020617',
            padding: '1.5rem', position: 'relative', overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(16,185,129,0.07)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            <div style={{
                width: '100%', maxWidth: '500px', position: 'relative', zIndex: 1,
                background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2rem',
                padding: 'clamp(1.75rem, 5vw, 2.75rem)',
                boxShadow: '0 32px 64px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '1.25rem',
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(99,102,241,0.15))',
                        border: '1px solid rgba(16,185,129,0.3)', margin: '0 auto 1.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(16,185,129,0.2)'
                    }}>
                        <UserPlus size={30} color="#34d399" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '0.4rem' }}>
                        Join the <span style={{ background: 'linear-gradient(135deg, #34d399, #6366f1)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Network</span>
                    </h2>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                        Create your profile
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name & Email row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" placeholder="John Doe" value={formData.name} onChange={set('name')} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input type="email" placeholder="name@company.com" value={formData.email} onChange={set('email')} required />
                        </div>
                    </div>

                    {/* Password & Role row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                        <div>
                            <label style={labelStyle}>Password</label>
                            <input type="password" placeholder="••••••••••" value={formData.password} onChange={set('password')} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Role</label>
                            <select value={formData.role} onChange={set('role')}>
                                <option value="Employee">Employee (Portal)</option>
                                <option value="HR">HR Admin (Dashboard)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.08em', borderRadius: '1rem' }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(148,163,184,0.7)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;

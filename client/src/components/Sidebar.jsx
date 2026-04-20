import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    LayoutDashboard, Users, FileSearch, HelpCircle,
    UserCheck, DollarSign, LogOut, Menu, X, Zap
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => { setIsOpen(false); }, [location.pathname]);

    const hrItems = [
        { name: 'Dashboard',        icon: <LayoutDashboard size={18} />, path: '/' },
        { name: 'My Portal',        icon: <UserCheck size={18} />,       path: '/my-portal' },
        { name: 'Employees',        icon: <Users size={18} />,           path: '/employees' },
        { name: 'Resume Screen',    icon: <FileSearch size={18} />,      path: '/resume-screen' },
        { name: 'Interview Prep',   icon: <HelpCircle size={18} />,      path: '/interview-prep' },
        { name: 'Attendance',       icon: <UserCheck size={18} />,       path: '/attendance' },
        { name: 'Payroll',          icon: <DollarSign size={18} />,      path: '/payroll' },
    ];

    const employeeItems = [
        { name: 'My Portal', icon: <LayoutDashboard size={18} />, path: '/my-portal' },
    ];

    const navItems = user?.role === 'HR' ? hrItems : employeeItems;

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <>
            {/* Mobile hamburger */}
            <button
                className="mobile-menu-btn"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
            >
                <Menu size={20} />
            </button>

            {/* Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Close button (mobile) */}
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        display: 'none',
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.65rem', padding: '0.4rem', cursor: 'pointer', color: '#fff'
                    }}
                    className="sidebar-close-btn"
                >
                    <X size={18} />
                </button>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '0.875rem',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, boxShadow: '0 4px 15px rgba(99,102,241,0.4)'
                    }}>
                        <Zap size={18} color="#fff" fill="#fff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>
                            HRMS <span style={{ color: '#6366f1' }}>AI</span>
                        </h2>
                        <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>
                            Workforce Hub
                        </p>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(148,163,184,0.45)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem', padding: '0 0.75rem' }}>
                        Navigation
                    </p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User & Logout */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '0.65rem', flexShrink: 0,
                            background: 'linear-gradient(135deg, #6366f1, #10b981)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '0.85rem', color: '#fff'
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(148,163,184,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{user?.role}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="nav-link" style={{ color: '#f87171', width: '100%' }}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <style>{`
                @media (max-width: 768px) {
                    .sidebar-close-btn { display: block !important; }
                }
            `}</style>
        </>
    );
};

export default Sidebar;

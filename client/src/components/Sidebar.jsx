import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    Users, 
    FileSearch, 
    HelpCircle, 
    UserCheck, 
    DollarSign,
    Settings,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const hrItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'My Portal', icon: <UserCheck size={20} />, path: '/my-portal' },
        { name: 'Employees', icon: <Users size={20} />, path: '/employees' },
        { name: 'AI Resume Screen', icon: <FileSearch size={20} />, path: '/resume-screen' },
        { name: 'Interview Prep', icon: <HelpCircle size={20} />, path: '/interview-prep' },
        { name: 'Attendance', icon: <UserCheck size={20} />, path: '/attendance' },
        { name: 'Payroll', icon: <DollarSign size={20} />, path: '/payroll' },
    ];

    const employeeItems = [
        { name: 'My Portal', icon: <LayoutDashboard size={20} />, path: '/my-portal' },
    ];

    const navItems = user?.role === 'HR' ? hrItems : employeeItems;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="flex items-center mb-10 px-2">
                <div className="bg-primary flex items-center justify-center shadow-lg" style={{ width: '40px', height: '40px', borderRadius: '12px', marginRight: '16px', flexShrink: 0 }}>
                    <span className="text-white font-bold text-xl">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">
                    HRMS <span className="text-primary italic">AI</span>
                </h2>
            </div>
            
            <nav className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-4 px-3">Main Menu</p>
                {navItems.map((item) => (
                    <NavLink 
                        key={item.name} 
                        to={item.path} 
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto border-t border-border-color pt-6">
                <button className="nav-link w-full text-left bg-transparent border-none cursor-pointer">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
                <button onClick={handleLogout} className="nav-link w-full text-left bg-transparent border-none cursor-pointer hover:text-danger">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

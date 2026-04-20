import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="h-screen w-full flex items-center justify-center text-primary">Loading Auth...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirection based on role
        if (user.role === 'Employee') return <Navigate to="/my-portal" />;
        return <Navigate to="/" />;
    }

    return children;
};

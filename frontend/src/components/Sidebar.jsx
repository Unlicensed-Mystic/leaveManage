import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const navItems = {
    employee: [
        { to: '/employee/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/employee/apply-leave', label: 'Apply Leave', icon: '📝' },
        { to: '/employee/leaves', label: 'My Leaves', icon: '📋' },
        { to: '/employee/reimbursement', label: 'Reimbursement', icon: '💰' },
    ],
    manager: [
        { to: '/manager/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/manager/leave-requests', label: 'Leave Requests', icon: '📋' },
        { to: '/manager/reimbursements', label: 'Reimbursements', icon: '💰' },
        { to: '/manager/review-history', label: 'Review History', icon: '🗂️' },
    ],
    admin: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/admin/users', label: 'User Management', icon: '👥' },
        { to: '/admin/leaves', label: 'All Leaves', icon: '📋' },
        { to: '/admin/reimbursements', label: 'All Reimbursements', icon: '💰' },
    ],
};

const Sidebar = ({ mobileOpen, onClose }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const items = navItems[user?.role] || [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const roleColors = {
        admin: 'bg-purple-600',
        manager: 'bg-blue-600',
        employee: 'bg-emerald-600',
    };

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-[#1e293b] border-r border-[#334155] z-40 flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-[#334155]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                            LM
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-sm">LeaveManage</h1>
                            <p className="text-[#94a3b8] text-xs">HR Portal</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="px-4 py-4 border-b border-[#334155]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                            <span className={`inline-block text-xs text-white px-2 py-0.5 rounded-full ${roleColors[user?.role]}`}>
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                    : 'text-[#94a3b8] hover:bg-[#334155] hover:text-white'
                                }`
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Theme toggle + Logout */}
                <div className="p-4 border-t border-[#334155] space-y-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#94a3b8] hover:bg-[#334155] hover:text-white transition-all duration-200"
                    >
                        <span className="text-lg transition-transform duration-300" style={{ transform: theme === 'light' ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                            {theme === 'light' ? '🌙' : '☀️'}
                        </span>
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        <span className={`ml-auto w-10 h-5 rounded-full flex items-center px-0.5 transition-colors duration-300 ${theme === 'light' ? 'bg-indigo-200 justify-end' : 'bg-[#475569] justify-start'
                            }`}>
                            <span className={`w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${theme === 'light' ? 'bg-indigo-600' : 'bg-white'
                                }`} />
                        </span>
                    </button>
                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#94a3b8] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                    >
                        <span className="text-lg">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

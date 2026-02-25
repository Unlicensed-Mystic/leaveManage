import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatsCard from '../../components/StatsCard';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        api.get('/admin/stats').then((res) => {
            setStats(res.data.stats);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                    <div>
                        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-[#94a3b8] text-sm">System overview</p>
                    </div>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                <StatsCard icon="👥" label="Total Users" value={stats.totalUsers || 0} gradient="bg-gradient-to-br from-indigo-600 to-blue-700" />
                                <StatsCard icon="📋" label="Total Leaves" value={stats.totalLeaves || 0} gradient="bg-gradient-to-br from-violet-600 to-purple-700" />
                                <StatsCard icon="⏳" label="Pending Leaves" value={stats.pendingLeaves || 0} gradient="bg-gradient-to-br from-amber-600 to-orange-700" />
                                <StatsCard icon="✅" label="Approved Leaves" value={stats.approvedLeaves || 0} gradient="bg-gradient-to-br from-emerald-600 to-green-700" />
                                <StatsCard icon="💰" label="Reimbursements" value={stats.totalReimbursements || 0} gradient="bg-gradient-to-br from-teal-600 to-cyan-700" />
                                <StatsCard icon="🔔" label="Pending Reimbursements" value={stats.pendingReimbursements || 0} gradient="bg-gradient-to-br from-rose-600 to-red-700" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { href: '/admin/users', icon: '👥', title: 'User Management', desc: 'Create, edit roles, and manage users', color: 'from-indigo-600 to-blue-600' },
                                    { href: '/admin/leaves', icon: '📋', title: 'All Leaves', desc: 'View all leave requests across the company', color: 'from-violet-600 to-purple-600' },
                                    { href: '/admin/reimbursements', icon: '💰', title: 'All Reimbursements', desc: 'View all expense claims across the company', color: 'from-emerald-600 to-teal-600' },
                                ].map((item) => (
                                    <a key={item.href} href={item.href} className={`block p-5 rounded-2xl bg-gradient-to-br ${item.color} hover:opacity-90 transition-all group`}>
                                        <div className="text-3xl mb-3">{item.icon}</div>
                                        <h3 className="text-white font-bold mb-1 group-hover:translate-x-1 transition-transform">{item.title}</h3>
                                        <p className="text-white/70 text-sm">{item.desc}</p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

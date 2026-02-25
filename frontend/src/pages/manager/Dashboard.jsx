import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatsCard from '../../components/StatsCard';
import api from '../../api/axios';

const ManagerDashboard = () => {
    const [stats, setStats] = useState({ pending: 0, leaves: 0, reimbursements: 0, pendingR: 0 });
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [lRes, rRes] = await Promise.all([
                    api.get('/leaves/pending'),
                    api.get('/reimbursements/pending'),
                ]);
                setStats({
                    pending: lRes.data.leaves.length,
                    leaves: lRes.data.leaves.length,
                    reimbursements: rRes.data.reimbursements.length,
                    pendingR: rRes.data.reimbursements.length,
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                    <div>
                        <h1 className="text-xl font-bold text-white">Manager Dashboard</h1>
                        <p className="text-[#94a3b8] text-sm">Review and manage requests</p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatsCard icon="📋" label="Pending Leaves" value={stats.pending} subtext="awaiting approval" gradient="bg-gradient-to-br from-amber-600 to-orange-700" />
                        <StatsCard icon="💰" label="Pending Reimbursements" value={stats.pendingR} subtext="awaiting approval" gradient="bg-gradient-to-br from-emerald-600 to-teal-700" />
                        <StatsCard icon="🎯" label="Total My Reviews" value={stats.leaves + stats.reimbursements} subtext="pending actions" gradient="bg-gradient-to-br from-indigo-600 to-blue-700" />
                        <StatsCard icon="⚡" label="Action Required" value={stats.pending + stats.pendingR} subtext="total pending" gradient="bg-gradient-to-br from-rose-600 to-red-700" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-2">Leave Requests</h3>
                            <p className="text-[#94a3b8] text-sm mb-4">Review and approve/reject leave applications</p>
                            <a href="/manager/leave-requests" className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-all">
                                📋 View {stats.pending} Pending Leaves
                            </a>
                        </div>
                        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-2">Reimbursement Requests</h3>
                            <p className="text-[#94a3b8] text-sm mb-4">Review and approve/reject expense claims</p>
                            <a href="/manager/reimbursements" className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:opacity-90 transition-all">
                                💰 View {stats.pendingR} Pending Reimbursements
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagerDashboard;

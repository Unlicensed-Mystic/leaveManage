import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { LoadingSpinner, ErrorMessage } from '../../components/UIStates';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [lRes, rRes] = await Promise.all([
                api.get('/leaves/my'),
                api.get('/reimbursements/my'),
            ]);
            setLeaves(lRes.data.leaves);
            setReimbursements(rRes.data.reimbursements);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const pending = leaves.filter((l) => l.status === 'pending').length;
    const approved = leaves.filter((l) => l.status === 'approved').length;
    const rejected = leaves.filter((l) => l.status === 'rejected').length;

    const pieData = [
        { name: 'Pending', value: pending || 0 },
        { name: 'Approved', value: approved || 0 },
        { name: 'Rejected', value: rejected || 0 },
    ];
    const PIE_COLORS = ['#f59e0b', '#10b981', '#ef4444'];
    const recentLeaves = leaves.slice(0, 5);

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            <main className="flex-1 md:ml-64 overflow-y-auto">
                {/* Topbar */}
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                        <div>
                            <h1 className="text-xl font-bold text-white">Dashboard</h1>
                            <p className="text-[#94a3b8] text-sm">Welcome back, {user?.name}!</p>
                        </div>
                    </div>
                    <Link
                        to="/employee/apply-leave"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
                    >
                        <span>+</span> Apply Leave
                    </Link>
                </div>

                <div className="p-6 space-y-6">
                    {/* ── Loading state ── */}
                    {loading ? (
                        <LoadingSpinner size="md" />

                        /* ── Error state with retry ── */
                    ) : error ? (
                        <ErrorMessage message={error} onRetry={fetchData} />

                        /* ── Success state ── */
                    ) : (
                        <>
                            {/* Leave Balance Cards */}
                            <div>
                                <h2 className="text-white font-semibold mb-4">Leave Balance</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatsCard icon="🌴" label="Casual Leave" value={user?.leaveBalance?.casual ?? 0} subtext="days remaining" gradient="bg-gradient-to-br from-cyan-600 to-blue-700" />
                                    <StatsCard icon="🤒" label="Sick Leave" value={user?.leaveBalance?.sick ?? 0} subtext="days remaining" gradient="bg-gradient-to-br from-rose-600 to-red-700" />
                                    <StatsCard icon="✈️" label="Annual Leave" value={user?.leaveBalance?.annual ?? 0} subtext="days remaining" gradient="bg-gradient-to-br from-violet-600 to-purple-700" />
                                    <StatsCard icon="📊" label="Total Leaves" value={leaves.length} subtext="all time" gradient="bg-gradient-to-br from-indigo-600 to-blue-700" />
                                </div>
                            </div>

                            {/* Quick Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Pending', value: pending, color: 'text-amber-400' },
                                    { label: 'Approved', value: approved, color: 'text-emerald-400' },
                                    { label: 'Rejected', value: rejected, color: 'text-red-400' },
                                ].map((s) => (
                                    <div key={s.label} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-4 text-center">
                                        <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                                        <div className="text-[#94a3b8] text-sm mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Chart + Recent Leaves */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Pie Chart */}
                                <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Leave Status Overview</h3>
                                    {leaves.length === 0 ? (
                                        <div className="h-48 flex items-center justify-center text-[#94a3b8] text-sm">No leaves yet</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart>
                                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                    <div className="mt-2 space-y-2">
                                        {[['Pending', '#f59e0b', pending], ['Approved', '#10b981', approved], ['Rejected', '#ef4444', rejected]].map(([label, color, val]) => (
                                            <div key={label} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                                    <span className="text-[#94a3b8]">{label}</span>
                                                </div>
                                                <span className="text-white font-medium">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Leaves Table */}
                                <div className="lg:col-span-2 bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-white font-semibold">Recent Leaves</h3>
                                        <Link to="/employee/leaves" className="text-indigo-400 text-sm hover:text-indigo-300">View all →</Link>
                                    </div>
                                    {recentLeaves.length === 0 ? (
                                        <div className="text-center py-8 text-[#94a3b8]">No leaves applied yet</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-[#334155]">
                                                        {['Type', 'Duration', 'Days', 'Status'].map((h) => (
                                                            <th key={h} className="py-3 text-left text-[#94a3b8] font-medium">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#334155]">
                                                    {recentLeaves.map((l) => (
                                                        <tr key={l._id} className="hover:bg-[#334155]/50 transition-colors">
                                                            <td className="py-3 text-white capitalize font-medium">{l.type}</td>
                                                            <td className="py-3 text-[#94a3b8]">
                                                                {new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}
                                                            </td>
                                                            <td className="py-3 text-white">{l.totalDays}</td>
                                                            <td className="py-3"><StatusBadge status={l.status} /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reimbursement Summary */}
                            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-semibold">💰 Recent Reimbursements</h3>
                                    <Link to="/employee/reimbursement" className="text-indigo-400 text-sm hover:text-indigo-300">Manage →</Link>
                                </div>
                                {reimbursements.length === 0 ? (
                                    <div className="text-center py-6 text-[#94a3b8]">No reimbursements submitted yet</div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {reimbursements.slice(0, 3).map((r) => (
                                            <div key={r._id} className="bg-[#0f172a] rounded-xl p-4 border border-[#334155]">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white font-medium capitalize text-sm">{r.category}</span>
                                                    <StatusBadge status={r.status} />
                                                </div>
                                                <div className="text-2xl font-bold text-emerald-400">₹{r.amount.toLocaleString()}</div>
                                                <div className="text-[#94a3b8] text-xs mt-1">{r.description.slice(0, 50)}...</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EmployeeDashboard;

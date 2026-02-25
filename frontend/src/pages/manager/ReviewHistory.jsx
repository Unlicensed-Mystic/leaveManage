import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const categoryIcons = { travel: '✈️', food: '🍽️', accommodation: '🏨', medical: '💊', equipment: '💻', other: '📦' };

const ReviewHistory = () => {
    const [leaves, setLeaves] = useState([]);
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('leaves');
    const [filter, setFilter] = useState('all');
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [lRes, rRes] = await Promise.all([
                    api.get('/leaves/reviewed'),
                    api.get('/reimbursements/reviewed'),
                ]);
                setLeaves(lRes.data.leaves);
                setReimbursements(rRes.data.reimbursements);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredLeaves = filter === 'all' ? leaves : leaves.filter((l) => l.status === filter);
    const filteredReimbursements = filter === 'all' ? reimbursements : reimbursements.filter((r) => r.status === filter);

    const totalApproved = reimbursements
        .filter((r) => r.status === 'approved')
        .reduce((s, r) => s + r.amount, 0);

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            <main className="flex-1 md:ml-64 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                    <div>
                        <h1 className="text-xl font-bold text-white">Review History</h1>
                        <p className="text-[#94a3b8] text-sm">All requests you've reviewed</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { icon: '📋', label: 'Leaves Reviewed', value: leaves.length, grad: 'from-indigo-600 to-blue-700' },
                            { icon: '✅', label: 'Leaves Approved', value: leaves.filter(l => l.status === 'approved').length, grad: 'from-emerald-600 to-green-700' },
                            { icon: '💰', label: 'Claims Reviewed', value: reimbursements.length, grad: 'from-violet-600 to-purple-700' },
                            { icon: '💵', label: 'Amount Approved', value: `₹${totalApproved.toLocaleString()}`, grad: 'from-teal-600 to-cyan-700' },
                        ].map((s) => (
                            <div key={s.label} className={`bg-gradient-to-br ${s.grad} rounded-2xl p-4 relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/10 -translate-y-4 translate-x-4" />
                                <div className="text-2xl mb-2">{s.icon}</div>
                                <div className="text-2xl font-bold text-white">{s.value}</div>
                                <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs — Leaves / Reimbursements */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setTab('leaves'); setFilter('all'); }}
                                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all
                  ${tab === 'leaves' ? 'bg-indigo-600 text-white' : 'bg-[#1e293b] border border-[#334155] text-[#94a3b8] hover:text-white'}`}
                            >
                                📋 Leaves ({leaves.length})
                            </button>
                            <button
                                onClick={() => { setTab('reimbursements'); setFilter('all'); }}
                                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all
                  ${tab === 'reimbursements' ? 'bg-emerald-600 text-white' : 'bg-[#1e293b] border border-[#334155] text-[#94a3b8] hover:text-white'}`}
                            >
                                💰 Reimbursements ({reimbursements.length})
                            </button>
                        </div>

                        {/* Status filter */}
                        <div className="flex gap-2">
                            {['all', 'approved', 'rejected'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
                    ${filter === f ? 'bg-[#475569] text-white' : 'bg-[#1e293b] border border-[#334155] text-[#64748b] hover:text-white'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : tab === 'leaves' ? (
                        /* ── Leave History Table ── */
                        filteredLeaves.length === 0 ? (
                            <div className="text-center py-16 bg-[#1e293b] rounded-2xl border border-[#334155]">
                                <div className="text-5xl mb-3">📋</div>
                                <p className="text-[#94a3b8]">No reviewed leaves found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredLeaves.map((l) => (
                                    <div key={l._id} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 hover:border-[#475569] transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {l.employee?.name?.[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                        <span className="text-white font-semibold">{l.employee?.name}</span>
                                                        <span className="text-[#94a3b8] text-xs bg-[#334155] px-2 py-0.5 rounded-full">{l.employee?.department}</span>
                                                        <StatusBadge status={l.status} />
                                                    </div>
                                                    <div className="text-[#94a3b8] text-sm">
                                                        <span className="capitalize text-white font-medium">{l.type}</span> Leave ·{' '}
                                                        {new Date(l.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        {' → '}
                                                        {new Date(l.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        <span className="ml-2 text-white bg-[#334155] px-2 py-0.5 rounded-full text-xs">{l.totalDays} day{l.totalDays > 1 ? 's' : ''}</span>
                                                    </div>
                                                    <p className="text-[#64748b] text-sm mt-1">💬 {l.reason}</p>
                                                    {l.reviewNote && (
                                                        <p className="text-amber-400 text-xs mt-1.5 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-1">
                                                            📝 Your note: {l.reviewNote}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-[#64748b] whitespace-nowrap">
                                                {new Date(l.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        /* ── Reimbursement History ── */
                        filteredReimbursements.length === 0 ? (
                            <div className="text-center py-16 bg-[#1e293b] rounded-2xl border border-[#334155]">
                                <div className="text-5xl mb-3">💰</div>
                                <p className="text-[#94a3b8]">No reviewed reimbursements found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredReimbursements.map((r) => (
                                    <div key={r._id} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 hover:border-[#475569] transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#0f172a] flex items-center justify-center text-2xl flex-shrink-0">
                                                    {categoryIcons[r.category]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                        <span className="text-white font-semibold">{r.employee?.name}</span>
                                                        <span className="text-[#94a3b8] text-xs bg-[#334155] px-2 py-0.5 rounded-full">{r.employee?.department}</span>
                                                        <StatusBadge status={r.status} />
                                                    </div>
                                                    <div className="text-3xl font-bold text-emerald-400 mb-1">₹{r.amount.toLocaleString()}</div>
                                                    <p className="text-[#94a3b8] text-sm capitalize">
                                                        {r.category} · 📅 {new Date(r.expenseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[#64748b] text-sm mt-0.5">{r.description}</p>
                                                    {r.reviewNote && (
                                                        <p className="text-amber-400 text-xs mt-1.5 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-1">
                                                            📝 Your note: {r.reviewNote}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-[#64748b] whitespace-nowrap">
                                                {new Date(r.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReviewHistory;

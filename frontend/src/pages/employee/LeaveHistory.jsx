import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const LeaveHistory = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        api.get('/leaves/my').then((res) => {
            setLeaves(res.data.leaves);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const filtered = filter === 'all' ? leaves : leaves.filter((l) => l.status === filter);

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                    <div>
                        <h1 className="text-xl font-bold text-white">My Leaves</h1>
                        <p className="text-[#94a3b8] text-sm">{leaves.length} total requests</p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Filter tabs */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {['all', 'pending', 'approved', 'rejected'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                  ${filter === f ? 'bg-indigo-600 text-white' : 'bg-[#1e293b] border border-[#334155] text-[#94a3b8] hover:text-white'}`}
                            >
                                {f} ({f === 'all' ? leaves.length : leaves.filter((l) => l.status === f).length})
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-5xl mb-4">📋</div>
                            <p className="text-[#94a3b8]">No leaves found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((l) => (
                                <div key={l._id} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 hover:border-[#475569] transition-all">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-white font-semibold capitalize">{l.type} Leave</span>
                                                <StatusBadge status={l.status} />
                                            </div>
                                            <div className="text-[#94a3b8] text-sm mb-1">
                                                📅 {new Date(l.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                {' → '}
                                                {new Date(l.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                <span className="ml-2 bg-[#334155] px-2 py-0.5 rounded-full text-xs text-white">{l.totalDays} day{l.totalDays > 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="text-[#94a3b8] text-sm">💬 {l.reason}</div>
                                            {l.reviewNote && (
                                                <div className="mt-2 text-xs text-amber-400 bg-amber-400/10 rounded-lg px-3 py-2 border border-amber-400/20">
                                                    📝 Manager note: {l.reviewNote}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-[#64748b] whitespace-nowrap">
                                            {new Date(l.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LeaveHistory;

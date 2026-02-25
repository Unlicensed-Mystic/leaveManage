import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const categoryIcons = {
    travel: '✈️', food: '🍽️', accommodation: '🏨', medical: '💊', equipment: '💻', other: '📦'
};

const ReimbursementRequests = () => {
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [note, setNote] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const fetchData = async () => {
        try {
            const { data } = await api.get('/reimbursements/pending');
            setReimbursements(data.reimbursements);
        } catch (err) {
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAction = async (status) => {
        setActionLoading(true);
        try {
            await api.put(`/reimbursements/${selected._id}/status`, { status, reviewNote: note });
            toast.success(`Reimbursement ${status}!`);
            setSelected(null);
            setNote('');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Toaster position="top-right" />
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            {selected && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">{categoryIcons[selected.category]}</div>
                            <div>
                                <h3 className="text-white font-bold capitalize">{selected.category} Expense</h3>
                                <p className="text-[#94a3b8] text-sm">{selected.employee?.name} · {selected.employee?.department}</p>
                            </div>
                        </div>
                        <div className="bg-[#0f172a] rounded-xl p-4 space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-[#94a3b8] text-sm">Amount</span>
                                <span className="text-emerald-400 font-bold text-lg">₹{selected.amount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#94a3b8] text-sm">Date</span>
                                <span className="text-white text-sm">{new Date(selected.expenseDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#94a3b8] text-sm">Description</span>
                                <span className="text-white text-sm text-right max-w-48">{selected.description}</span>
                            </div>
                            {selected.receiptUrl && (
                                <div className="flex justify-between">
                                    <span className="text-[#94a3b8] text-sm">Receipt</span>
                                    <a href={selected.receiptUrl} target="_blank" rel="noreferrer" className="text-indigo-400 text-sm hover:underline">View →</a>
                                </div>
                            )}
                        </div>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#475569] text-white placeholder-[#64748b] resize-none focus:outline-none focus:border-emerald-500 mb-4"
                            placeholder="Add review note..."
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-xl border border-[#475569] text-[#94a3b8] hover:bg-[#334155] text-sm">Cancel</button>
                            <button onClick={() => handleAction('rejected')} disabled={actionLoading} className="flex-1 py-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 text-sm disabled:opacity-50">❌ Reject</button>
                            <button onClick={() => handleAction('approved')} disabled={actionLoading} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-sm font-semibold disabled:opacity-50">{actionLoading ? '...' : '✅ Approve'}</button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                    <div>
                        <h1 className="text-xl font-bold text-white">Reimbursement Requests</h1>
                        <p className="text-[#94a3b8] text-sm">{reimbursements.length} pending claims</p>
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : reimbursements.length === 0 ? (
                        <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-[#334155]">
                            <div className="text-5xl mb-4">🎉</div>
                            <p className="text-white font-semibold">All caught up!</p>
                            <p className="text-[#94a3b8] text-sm mt-2">No pending reimbursement requests</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {reimbursements.map((r) => (
                                <div key={r._id} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 hover:border-[#475569] transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{categoryIcons[r.category]}</div>
                                            <div>
                                                <p className="text-white font-semibold capitalize">{r.category}</p>
                                                <p className="text-[#94a3b8] text-xs">{r.employee?.name} · {r.employee?.department}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={r.status} />
                                    </div>
                                    <div className="text-3xl font-bold text-emerald-400 mb-2">₹{r.amount.toLocaleString()}</div>
                                    <p className="text-[#94a3b8] text-sm mb-3">{r.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#64748b] text-xs">📅 {new Date(r.expenseDate).toLocaleDateString()}</span>
                                        <button
                                            onClick={() => setSelected(r)}
                                            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-all"
                                        >
                                            Review
                                        </button>
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

export default ReimbursementRequests;

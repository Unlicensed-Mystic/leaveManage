import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const ReviewModal = ({ item, type, onClose, onSuccess }) => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAction = async (status) => {
        setLoading(true);
        try {
            const endpoint = type === 'leave' ? `/leaves/${item._id}/status` : `/reimbursements/${item._id}/status`;
            await api.put(endpoint, { status, reviewNote: note });
            toast.success(`${type === 'leave' ? 'Leave' : 'Reimbursement'} ${status}!`);
            onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-white font-bold text-lg mb-4">Review {type === 'leave' ? 'Leave' : 'Reimbursement'} Request</h3>
                <div className="bg-[#0f172a] rounded-xl p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#94a3b8]">Employee</span>
                        <span className="text-white">{item.employee?.name}</span>
                    </div>
                    {type === 'leave' ? (
                        <>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#94a3b8]">Type</span>
                                <span className="text-white capitalize">{item.type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#94a3b8]">Duration</span>
                                <span className="text-white">{item.totalDays} day(s)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#94a3b8]">Reason</span>
                                <span className="text-white text-right max-w-48">{item.reason}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#94a3b8]">Category</span>
                                <span className="text-white capitalize">{item.category}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#94a3b8]">Amount</span>
                                <span className="text-emerald-400 font-bold">₹{item.amount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#94a3b8]">Description</span>
                                <span className="text-white text-right max-w-48">{item.description}</span>
                            </div>
                        </>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-[#94a3b8] mb-2">Note (optional)</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#475569] text-white placeholder-[#64748b] resize-none focus:outline-none focus:border-indigo-500"
                        placeholder="Add a review note..."
                    />
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#475569] text-[#94a3b8] hover:bg-[#334155] transition-all text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={() => handleAction('rejected')}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition-all text-sm font-medium disabled:opacity-50"
                    >
                        ❌ Reject
                    </button>
                    <button
                        onClick={() => handleAction('approved')}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all text-sm font-semibold disabled:opacity-50"
                    >
                        {loading ? '...' : '✅ Approve'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LeaveRequests = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const fetchLeaves = async () => {
        try {
            const { data } = await api.get('/leaves/pending');
            setLeaves(data.leaves);
        } catch (err) {
            toast.error('Failed to load leave requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeaves(); }, []);

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Toaster position="top-right" />
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            {selected && (
                <ReviewModal type="leave" item={selected} onClose={() => setSelected(null)} onSuccess={() => { setSelected(null); fetchLeaves(); }} />
            )}

            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                    <div>
                        <h1 className="text-xl font-bold text-white">Leave Requests</h1>
                        <p className="text-[#94a3b8] text-sm">{leaves.length} pending requests</p>
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : leaves.length === 0 ? (
                        <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-[#334155]">
                            <div className="text-5xl mb-4">🎉</div>
                            <p className="text-white font-semibold">All caught up!</p>
                            <p className="text-[#94a3b8] text-sm mt-2">No pending leave requests</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#334155]">
                                        {['Employee', 'Department', 'Type', 'Duration', 'Days', 'Reason', 'Applied', 'Action'].map((h) => (
                                            <th key={h} className="py-3 px-4 text-left text-[#94a3b8] text-sm font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#334155]">
                                    {leaves.map((l) => (
                                        <tr key={l._id} className="hover:bg-[#1e293b] transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                                        {l.employee?.name?.[0]}
                                                    </div>
                                                    <span className="text-white text-sm font-medium">{l.employee?.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-[#94a3b8] text-sm">{l.employee?.department}</td>
                                            <td className="py-4 px-4 text-white capitalize text-sm">{l.type}</td>
                                            <td className="py-4 px-4 text-[#94a3b8] text-xs">
                                                {new Date(l.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} –{' '}
                                                {new Date(l.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            </td>
                                            <td className="py-4 px-4 text-white text-sm">{l.totalDays}</td>
                                            <td className="py-4 px-4 text-[#94a3b8] text-sm max-w-40 truncate">{l.reason}</td>
                                            <td className="py-4 px-4 text-[#64748b] text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 px-4">
                                                <button
                                                    onClick={() => setSelected(l)}
                                                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all"
                                                >
                                                    Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LeaveRequests;

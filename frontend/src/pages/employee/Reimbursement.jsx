import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const categories = ['travel', 'food', 'accommodation', 'medical', 'equipment', 'other'];

const categoryIcons = {
    travel: '✈️', food: '🍽️', accommodation: '🏨', medical: '💊', equipment: '💻', other: '📦'
};

const Reimbursement = () => {
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState('all');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [form, setForm] = useState({
        category: 'travel', amount: '', description: '', expenseDate: '', receiptUrl: ''
    });

    const fetchData = async () => {
        try {
            const { data } = await api.get('/reimbursements/my');
            setReimbursements(data.reimbursements);
        } catch (err) {
            toast.error('Failed to load reimbursements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.amount || parseFloat(form.amount) <= 0) return toast.error('Enter a valid amount');
        setSubmitting(true);
        try {
            await api.post('/reimbursements', { ...form, amount: parseFloat(form.amount) });
            toast.success('Reimbursement submitted! 💰');
            setForm({ category: 'travel', amount: '', description: '', expenseDate: '', receiptUrl: '' });
            setShowForm(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = filter === 'all' ? reimbursements : reimbursements.filter((r) => r.status === filter);
    const totalApproved = reimbursements.filter((r) => r.status === 'approved').reduce((s, r) => s + r.amount, 0);

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Toaster position="top-right" />
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                        <div>
                            <h1 className="text-xl font-bold text-white">Reimbursement</h1>
                            <p className="text-[#94a3b8] text-sm">Manage your expense claims</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold hover:opacity-90 transition-all"
                    >
                        {showForm ? '✕ Cancel' : '+ New Claim'}
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Claims', value: reimbursements.length, icon: '📑', color: 'from-indigo-600 to-blue-700' },
                            { label: 'Pending', value: reimbursements.filter(r => r.status === 'pending').length, icon: '⏳', color: 'from-amber-600 to-orange-700' },
                            { label: 'Approved', value: reimbursements.filter(r => r.status === 'approved').length, icon: '✅', color: 'from-emerald-600 to-green-700' },
                            { label: 'Total Approved', value: `₹${totalApproved.toLocaleString()}`, icon: '💰', color: 'from-violet-600 to-purple-700' },
                        ].map((s) => (
                            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/10 -translate-y-4 translate-x-4" />
                                <div className="text-2xl mb-2">{s.icon}</div>
                                <div className="text-2xl font-bold text-white">{s.value}</div>
                                <div className="text-white/70 text-xs">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* New Claim Form */}
                    {showForm && (
                        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-4">Submit New Claim</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-[#94a3b8] mb-2">Category</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setForm({ ...form, category: cat })}
                                                className={`p-3 rounded-xl border-2 text-center transition-all
                          ${form.category === cat ? 'border-emerald-500 bg-emerald-500/10' : 'border-[#475569] bg-[#0f172a] hover:border-[#64748b]'}`}
                                            >
                                                <div className="text-xl">{categoryIcons[cat]}</div>
                                                <div className="text-xs text-[#94a3b8] mt-1 capitalize">{cat}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#94a3b8] mb-2">Amount (₹)</label>
                                        <input
                                            type="number"
                                            value={form.amount}
                                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white
                        focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                            placeholder="0.00"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#94a3b8] mb-2">Expense Date</label>
                                        <input
                                            type="date"
                                            value={form.expenseDate}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white
                        focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#94a3b8] mb-2">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white placeholder-[#64748b] resize-none
                      focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Describe the expense..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#94a3b8] mb-2">Receipt URL (optional)</label>
                                    <input
                                        type="url"
                                        value={form.receiptUrl}
                                        onChange={(e) => setForm({ ...form, receiptUrl: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white placeholder-[#64748b]
                      focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                        placeholder="https://..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                                >
                                    {submitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </span>
                                    ) : 'Submit Claim'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* History */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Claim History</h3>
                            <div className="flex gap-2">
                                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all
                      ${filter === f ? 'bg-indigo-600 text-white' : 'bg-[#334155] text-[#94a3b8] hover:text-white'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-16 bg-[#1e293b] rounded-2xl border border-[#334155]">
                                <div className="text-4xl mb-3">💰</div>
                                <p className="text-[#94a3b8]">No reimbursement claims found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map((r) => (
                                    <div key={r._id} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 hover:border-[#475569] transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center text-2xl flex-shrink-0">
                                                    {categoryIcons[r.category]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-white font-semibold capitalize">{r.category}</span>
                                                        <StatusBadge status={r.status} />
                                                    </div>
                                                    <div className="text-3xl font-bold text-emerald-400">₹{r.amount.toLocaleString()}</div>
                                                    <p className="text-[#94a3b8] text-sm mt-1">{r.description}</p>
                                                    <div className="text-[#64748b] text-xs mt-1">
                                                        📅 {new Date(r.expenseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </div>
                                                    {r.reviewNote && (
                                                        <div className="mt-2 text-xs text-amber-400 bg-amber-400/10 rounded-lg px-3 py-1.5 border border-amber-400/20">
                                                            📝 {r.reviewNote}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-[#64748b] text-xs whitespace-nowrap">
                                                {new Date(r.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reimbursement;

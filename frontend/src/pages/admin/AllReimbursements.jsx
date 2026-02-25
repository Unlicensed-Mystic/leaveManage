import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const categoryIcons = { travel: '✈️', food: '🍽️', accommodation: '🏨', medical: '💊', equipment: '💻', other: '📦' };

const AllReimbursements = () => {
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        api.get('/reimbursements/all').then((res) => {
            setReimbursements(res.data.reimbursements);
        }).finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'all' ? reimbursements : reimbursements.filter((r) => r.status === filter);
    const totalApproved = reimbursements.filter(r => r.status === 'approved').reduce((s, r) => s + r.amount, 0);

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                        <div>
                            <h1 className="text-xl font-bold text-white">All Reimbursements</h1>
                            <p className="text-[#94a3b8] text-sm">{reimbursements.length} total · ₹{totalApproved.toLocaleString()} approved</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'pending', 'approved', 'rejected'].map((f) => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${filter === f ? 'bg-indigo-600 text-white' : 'bg-[#1e293b] border border-[#334155] text-[#94a3b8]'}`}>
                                {f} ({f === 'all' ? reimbursements.length : reimbursements.filter(r => r.status === f).length})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : (
                        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[#334155]">
                                            {['', 'Employee', 'Dept', 'Category', 'Amount', 'Description', 'Expense Date', 'Status', 'Reviewed By', 'Submitted'].map((h) => (
                                                <th key={h} className="py-3 px-4 text-left text-[#94a3b8] font-medium text-xs">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#334155]">
                                        {filtered.map((r) => (
                                            <tr key={r._id} className="hover:bg-[#334155]/30 transition-colors">
                                                <td className="py-3 px-4 text-xl">{categoryIcons[r.category]}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">{r.employee?.name?.[0]}</div>
                                                        <span className="text-white font-medium whitespace-nowrap">{r.employee?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-[#94a3b8] text-xs">{r.employee?.department}</td>
                                                <td className="py-3 px-4 text-white capitalize">{r.category}</td>
                                                <td className="py-3 px-4 text-emerald-400 font-bold whitespace-nowrap">₹{r.amount.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-[#94a3b8] max-w-36 truncate">{r.description}</td>
                                                <td className="py-3 px-4 text-[#94a3b8] text-xs">{new Date(r.expenseDate).toLocaleDateString()}</td>
                                                <td className="py-3 px-4"><StatusBadge status={r.status} /></td>
                                                <td className="py-3 px-4 text-[#94a3b8] text-xs">{r.reviewedBy?.name || '—'}</td>
                                                <td className="py-3 px-4 text-[#64748b] text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filtered.length === 0 && (
                                    <div className="text-center py-12 text-[#94a3b8]">No records found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AllReimbursements;

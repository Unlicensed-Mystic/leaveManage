import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const leaveTypes = [
    { value: 'casual', label: 'Casual Leave', icon: '🌴', desc: 'For personal errands & short breaks' },
    { value: 'sick', label: 'Sick Leave', icon: '🤒', desc: 'Medical illness or health conditions' },
    { value: 'annual', label: 'Annual Leave', icon: '✈️', desc: 'Planned vacation or long holidays' },
    { value: 'unpaid', label: 'Unpaid Leave', icon: '📋', desc: 'Leave without pay' },
];

const ApplyLeave = () => {
    const [form, setForm] = useState({ type: 'casual', startDate: '', endDate: '', reason: '' });
    const [loading, setLoading] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const calcDays = () => {
        if (!form.startDate || !form.endDate) return 0;
        const diff = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1;
        return diff > 0 ? diff : 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (calcDays() <= 0) return toast.error('End date must be after start date');
        setLoading(true);
        try {
            await api.post('/leaves', form);
            toast.success('Leave application submitted! 🎉');
            setTimeout(() => navigate('/employee/leaves'), 1200);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit leave');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Toaster position="top-right" />
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                    <div>
                        <h1 className="text-xl font-bold text-white">Apply Leave</h1>
                        <p className="text-[#94a3b8] text-sm">Submit a new leave request</p>
                    </div>
                </div>

                <div className="p-6 max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Leave Type */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-3">Leave Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {leaveTypes.map((lt) => (
                                    <button
                                        key={lt.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, type: lt.value })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200
                      ${form.type === lt.value
                                                ? 'border-indigo-500 bg-indigo-500/10'
                                                : 'border-[#334155] bg-[#1e293b] hover:border-[#475569]'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{lt.icon}</div>
                                        <div className="text-white font-medium text-sm">{lt.label}</div>
                                        <div className="text-[#94a3b8] text-xs mt-0.5">{lt.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#94a3b8] mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={form.startDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white
                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#94a3b8] mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={form.endDate}
                                    min={form.startDate || new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white
                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Duration preview */}
                        {calcDays() > 0 && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                                <span className="text-2xl">📅</span>
                                <div>
                                    <span className="text-indigo-400 font-bold text-lg">{calcDays()}</span>
                                    <span className="text-white ml-2 text-sm">day{calcDays() > 1 ? 's' : ''} of leave</span>
                                </div>
                            </div>
                        )}

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Reason</label>
                            <textarea
                                value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white placeholder-[#64748b] resize-none
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="Briefly describe your reason for leave..."
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/employee/dashboard')}
                                className="flex-1 py-3 rounded-xl border border-[#475569] text-[#94a3b8] hover:bg-[#334155] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </span>
                                ) : 'Submit Leave Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ApplyLeave;

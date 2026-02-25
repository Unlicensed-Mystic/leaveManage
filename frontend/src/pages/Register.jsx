import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const departments = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales', 'Design', 'General'];

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', department: 'General' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', form);
            login(data.user, data.token);
            toast.success('Account created! Welcome 🎉');
            navigate('/employee/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
            <Toaster position="top-right" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-2xl">
                        LM
                    </div>
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="text-[#94a3b8] mt-2">Join LeaveManage as an employee</p>
                </div>

                <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white placeholder-[#64748b]
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white placeholder-[#64748b]
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="you@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Department</label>
                            <select
                                value={form.department}
                                onChange={(e) => setForm({ ...form, department: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            >
                                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#475569] text-white placeholder-[#64748b]
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="Min. 6 characters"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold
                hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-[#94a3b8]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

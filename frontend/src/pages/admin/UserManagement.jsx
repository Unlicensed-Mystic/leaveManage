import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const ROLES = ['employee', 'manager', 'admin'];
const DEPTS = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales', 'Design', 'General'];

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', department: 'General' });
    const [editForm, setEditForm] = useState({ role: '', department: '', isActive: true });
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data.users);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', form);
            toast.success('User created!');
            setForm({ name: '', email: '', password: '', role: 'employee', department: 'General' });
            setShowCreateForm(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Create failed');
        }
    };

    const handleUpdateRole = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/role`, editForm);
            toast.success('User updated!');
            setEditUser(null);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const handleDelete = async (userId, name) => {
        if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success('User deleted');
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.department.toLowerCase().includes(search.toLowerCase())
    );

    const roleColors = { admin: 'text-purple-400 bg-purple-400/10', manager: 'text-blue-400 bg-blue-400/10', employee: 'text-emerald-400 bg-emerald-400/10' };

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Toaster position="top-right" />
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            {/* Edit Modal */}
            {editUser && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setEditUser(null)}>
                    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-white font-bold mb-4">Edit User: {editUser.name}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-[#94a3b8] mb-1">Role</label>
                                <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-[#475569] text-white focus:outline-none focus:border-indigo-500">
                                    {ROLES.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-[#94a3b8] mb-1">Department</label>
                                <select value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-[#475569] text-white focus:outline-none focus:border-indigo-500">
                                    {DEPTS.map((d) => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} className="w-4 h-4 accent-indigo-500" id="isActive" />
                                <label htmlFor="isActive" className="text-sm text-[#94a3b8]">Account Active</label>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 rounded-xl border border-[#475569] text-[#94a3b8] text-sm">Cancel</button>
                            <button onClick={() => handleUpdateRole(editUser._id)} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur border-b border-[#334155] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#94a3b8] text-xl">☰</button>
                        <div>
                            <h1 className="text-xl font-bold text-white">User Management</h1>
                            <p className="text-[#94a3b8] text-sm">{users.length} users</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-4 py-2 rounded-xl bg-[#1e293b] border border-[#334155] text-white text-sm placeholder-[#64748b] focus:outline-none focus:border-indigo-500 w-48"
                        />
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90"
                        >
                            + New User
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Create Form */}
                    {showCreateForm && (
                        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-4">Create New User</h3>
                            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[['name', 'Full Name', 'text', 'John Doe'], ['email', 'Email', 'email', 'user@company.com'], ['password', 'Password', 'password', 'Min. 6 chars']].map(([field, label, type, ph]) => (
                                    <div key={field}>
                                        <label className="block text-sm text-[#94a3b8] mb-1">{label}</label>
                                        <input type={type} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                                            className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-[#475569] text-white placeholder-[#64748b] focus:outline-none focus:border-indigo-500"
                                            placeholder={ph} required />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm text-[#94a3b8] mb-1">Role</label>
                                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-[#475569] text-white focus:outline-none focus:border-indigo-500">
                                        {ROLES.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#94a3b8] mb-1">Department</label>
                                    <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-[#475569] text-white focus:outline-none focus:border-indigo-500">
                                        {DEPTS.map((d) => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="sm:col-span-2 flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowCreateForm(false)} className="flex-1 py-2.5 rounded-xl border border-[#475569] text-[#94a3b8] text-sm">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold">Create User</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : (
                        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#334155]">
                                            {['User', 'Email', 'Department', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                                                <th key={h} className="py-4 px-4 text-left text-[#94a3b8] text-sm font-medium">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#334155]">
                                        {filtered.map((u) => (
                                            <tr key={u._id} className="hover:bg-[#334155]/30 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                            {u.name[0]}
                                                        </div>
                                                        <span className="text-white text-sm font-medium">{u.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-[#94a3b8] text-sm">{u.email}</td>
                                                <td className="py-4 px-4 text-[#94a3b8] text-sm">{u.department}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleColors[u.role]}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                                        {u.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-[#64748b] text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => { setEditUser(u); setEditForm({ role: u.role, department: u.department, isActive: u.isActive }); }}
                                                            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs hover:bg-indigo-600/30 transition-all border border-indigo-500/30"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(u._id, u.name)}
                                                            className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 text-xs hover:bg-red-600/30 transition-all border border-red-500/30"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserManagement;

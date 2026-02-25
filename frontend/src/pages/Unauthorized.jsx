import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
    const { user } = useAuth();
    const links = { admin: '/admin/dashboard', manager: '/manager/dashboard', employee: '/employee/dashboard' };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="text-center">
                <div className="text-8xl mb-6">🚫</div>
                <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
                <p className="text-[#94a3b8] mb-8">You don't have permission to view this page.</p>
                <Link
                    to={links[user?.role] || '/login'}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-all"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Employee pages
import EmployeeDashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';
import Reimbursement from './pages/employee/Reimbursement';

// Manager pages
import ManagerDashboard from './pages/manager/Dashboard';
import LeaveRequests from './pages/manager/LeaveRequests';
import ReimbursementRequests from './pages/manager/ReimbursementRequests';
import ReviewHistory from './pages/manager/ReviewHistory';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import AllLeaves from './pages/admin/AllLeaves';
import AllReimbursements from './pages/admin/AllReimbursements';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Employee routes */}
          <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/apply-leave" element={<ApplyLeave />} />
            <Route path="/employee/leaves" element={<LeaveHistory />} />
            <Route path="/employee/reimbursement" element={<Reimbursement />} />
          </Route>

          {/* Manager routes */}
          <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/leave-requests" element={<LeaveRequests />} />
            <Route path="/manager/reimbursements" element={<ReimbursementRequests />} />
            <Route path="/manager/review-history" element={<ReviewHistory />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/leaves" element={<AllLeaves />} />
            <Route path="/admin/reimbursements" element={<AllReimbursements />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

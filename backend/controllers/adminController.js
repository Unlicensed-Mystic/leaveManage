const User = require('../models/User');
const Leave = require('../models/Leave');
const Reimbursement = require('../models/Reimbursement');

// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort('-createdAt');
        res.json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   POST /api/admin/users
// @access  Admin — create a new user with any role
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required' });
        }
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        const user = await User.create({ name, email, password, role: role || 'employee', department: department || 'General' });
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   PUT /api/admin/users/:id/role
// @access  Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role, department, isActive } = req.body;
        const update = {};
        if (role) update.role = role;
        if (department) update.department = department;
        if (typeof isActive === 'boolean') update.isActive = isActive;

        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "Cannot delete your own account" });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res) => {
    try {
        const [totalUsers, totalLeaves, pendingLeaves, approvedLeaves, totalReimbursements, pendingReimbursements] =
            await Promise.all([
                User.countDocuments(),
                Leave.countDocuments(),
                Leave.countDocuments({ status: 'pending' }),
                Leave.countDocuments({ status: 'approved' }),
                Reimbursement.countDocuments(),
                Reimbursement.countDocuments({ status: 'pending' }),
            ]);

        res.json({
            success: true,
            stats: { totalUsers, totalLeaves, pendingLeaves, approvedLeaves, totalReimbursements, pendingReimbursements },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

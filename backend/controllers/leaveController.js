const Leave = require('../models/Leave');
const User = require('../models/User');

// Helper: calculate business days
const calcDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
};

// @route   POST /api/leaves
// @access  Employee
exports.applyLeave = async (req, res) => {
    try {
        const { type, startDate, endDate, reason } = req.body;

        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ success: false, message: 'Start date cannot be after end date' });
        }

        const totalDays = calcDays(startDate, endDate);

        // Check leave balance (not for unpaid)
        if (type !== 'unpaid') {
            const user = await User.findById(req.user._id);
            if (user.leaveBalance[type] < totalDays) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient ${type} leave balance. Available: ${user.leaveBalance[type]} days`,
                });
            }
        }

        const leave = await Leave.create({
            employee: req.user._id,
            type,
            startDate,
            endDate,
            reason,
            totalDays,
        });

        await leave.populate('employee', 'name email department');

        res.status(201).json({ success: true, leave });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/leaves/my
// @access  Employee
exports.getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ employee: req.user._id })
            .populate('reviewedBy', 'name')
            .sort('-createdAt');
        res.json({ success: true, leaves });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/leaves/reviewed
// @access  Manager
exports.getReviewedLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({
            reviewedBy: req.user._id,
            status: { $in: ['approved', 'rejected'] },
        })
            .populate('employee', 'name email department')
            .sort('-updatedAt');
        res.json({ success: true, leaves });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/leaves/pending
// @access  Manager
exports.getPendingLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ status: 'pending' })
            .populate('employee', 'name email department')
            .sort('-createdAt');
        res.json({ success: true, leaves });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/leaves/all
// @access  Admin
exports.getAllLeaves = async (req, res) => {
    try {
        const { status, type } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const leaves = await Leave.find(filter)
            .populate('employee', 'name email department')
            .populate('reviewedBy', 'name')
            .sort('-createdAt');
        res.json({ success: true, count: leaves.length, leaves });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   PUT /api/leaves/:id/status
// @access  Manager
exports.updateLeaveStatus = async (req, res) => {
    try {
        const { status, reviewNote } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        if (leave.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Leave already reviewed' });
        }

        leave.status = status;
        leave.reviewedBy = req.user._id;
        leave.reviewNote = reviewNote || '';
        await leave.save();

        // Deduct balance only on approval
        if (status === 'approved' && leave.type !== 'unpaid') {
            await User.findByIdAndUpdate(leave.employee, {
                $inc: { [`leaveBalance.${leave.type}`]: -leave.totalDays },
            });
        }

        await leave.populate('employee', 'name email department');
        await leave.populate('reviewedBy', 'name');

        res.json({ success: true, leave });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

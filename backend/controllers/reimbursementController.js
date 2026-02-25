const Reimbursement = require('../models/Reimbursement');

// @route   POST /api/reimbursements
// @access  Employee
exports.submitReimbursement = async (req, res) => {
    try {
        const { category, amount, description, expenseDate, receiptUrl } = req.body;

        if (!category || !amount || !description || !expenseDate) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
        }

        const reimbursement = await Reimbursement.create({
            employee: req.user._id,
            category,
            amount,
            description,
            expenseDate,
            receiptUrl: receiptUrl || '',
        });

        await reimbursement.populate('employee', 'name email department');

        res.status(201).json({ success: true, reimbursement });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/reimbursements/my
// @access  Employee
exports.getMyReimbursements = async (req, res) => {
    try {
        const reimbursements = await Reimbursement.find({ employee: req.user._id })
            .populate('reviewedBy', 'name')
            .sort('-createdAt');
        res.json({ success: true, reimbursements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/reimbursements/reviewed
// @access  Manager
exports.getReviewedReimbursements = async (req, res) => {
    try {
        const reimbursements = await Reimbursement.find({
            reviewedBy: req.user._id,
            status: { $in: ['approved', 'rejected'] },
        })
            .populate('employee', 'name email department')
            .sort('-updatedAt');
        res.json({ success: true, reimbursements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/reimbursements/pending
// @access  Manager
exports.getPendingReimbursements = async (req, res) => {
    try {
        const reimbursements = await Reimbursement.find({ status: 'pending' })
            .populate('employee', 'name email department')
            .sort('-createdAt');
        res.json({ success: true, reimbursements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/reimbursements/all
// @access  Admin
exports.getAllReimbursements = async (req, res) => {
    try {
        const { status, category } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;

        const reimbursements = await Reimbursement.find(filter)
            .populate('employee', 'name email department')
            .populate('reviewedBy', 'name')
            .sort('-createdAt');
        res.json({ success: true, count: reimbursements.length, reimbursements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   PUT /api/reimbursements/:id/status
// @access  Manager
exports.updateReimbursementStatus = async (req, res) => {
    try {
        const { status, reviewNote } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const reimbursement = await Reimbursement.findById(req.params.id);
        if (!reimbursement) {
            return res.status(404).json({ success: false, message: 'Reimbursement request not found' });
        }

        if (reimbursement.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Reimbursement already reviewed' });
        }

        reimbursement.status = status;
        reimbursement.reviewedBy = req.user._id;
        reimbursement.reviewNote = reviewNote || '';
        await reimbursement.save();

        await reimbursement.populate('employee', 'name email department');
        await reimbursement.populate('reviewedBy', 'name');

        res.json({ success: true, reimbursement });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

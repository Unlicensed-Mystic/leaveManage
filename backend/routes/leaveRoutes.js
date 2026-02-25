const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getMyLeaves,
    getReviewedLeaves,
    getPendingLeaves,
    getAllLeaves,
    updateLeaveStatus,
} = require('../controllers/leaveController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const { validateApplyLeave, validateLeaveStatus } = require('../middleware/validate');

// Employee routes
router.post('/', protect, authorize('employee'), validateApplyLeave, applyLeave);
router.get('/my', protect, getMyLeaves);

// Manager routes
router.get('/reviewed', protect, authorize('manager', 'admin'), getReviewedLeaves);
router.get('/pending', protect, authorize('manager', 'admin'), getPendingLeaves);
router.put('/:id/status', protect, authorize('manager', 'admin'), validateLeaveStatus, updateLeaveStatus);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllLeaves);

module.exports = router;

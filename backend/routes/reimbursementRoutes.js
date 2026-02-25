const express = require('express');
const router = express.Router();
const {
    submitReimbursement,
    getMyReimbursements,
    getReviewedReimbursements,
    getPendingReimbursements,
    getAllReimbursements,
    updateReimbursementStatus,
} = require('../controllers/reimbursementController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const {
    validateSubmitReimbursement,
    validateReimbursementStatus,
} = require('../middleware/validate');

// Employee routes
router.post('/', protect, authorize('employee'), validateSubmitReimbursement, submitReimbursement);
router.get('/my', protect, getMyReimbursements);

// Manager routes
router.get('/reviewed', protect, authorize('manager', 'admin'), getReviewedReimbursements);
router.get('/pending', protect, authorize('manager', 'admin'), getPendingReimbursements);
router.put('/:id/status', protect, authorize('manager', 'admin'), validateReimbursementStatus, updateReimbursementStatus);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllReimbursements);

module.exports = router;

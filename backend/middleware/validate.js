const { body, param, validationResult } = require('express-validator');


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((e) => ({
                field: e.path,
                message: e.msg,
            })),
        });
    }
    next();
};


const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain at least one number'),

    body('department')
        .optional()
        .trim()
        .isLength({ max: 60 }).withMessage('Department name too long'),

    validate,
];

const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    validate,
];

const validateUpdateProfile = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),

    body('department')
        .optional()
        .trim()
        .isLength({ max: 60 }).withMessage('Department name too long'),

    validate,
];


const LEAVE_TYPES = ['casual', 'sick', 'annual', 'unpaid'];

const validateApplyLeave = [
    body('type')
        .notEmpty().withMessage('Leave type is required')
        .isIn(LEAVE_TYPES).withMessage(`Leave type must be one of: ${LEAVE_TYPES.join(', ')}`),

    body('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)')
        .toDate(),

    body('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be a valid date (YYYY-MM-DD)')
        .toDate()
        .custom((endDate, { req }) => {
            if (new Date(endDate) < new Date(req.body.startDate)) {
                throw new Error('End date cannot be before start date');
            }
            return true;
        }),

    body('reason')
        .trim()
        .notEmpty().withMessage('Reason is required')
        .isLength({ min: 10, max: 500 }).withMessage('Reason must be 10–500 characters'),

    validate,
];

const validateLeaveStatus = [
    param('id')
        .isMongoId().withMessage('Invalid leave ID'),

    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),

    body('reviewNote')
        .optional()
        .trim()
        .isLength({ max: 300 }).withMessage('Review note cannot exceed 300 characters'),

    validate,
];


const REIMBURSEMENT_CATEGORIES = ['travel', 'food', 'accommodation', 'medical', 'equipment', 'other'];

const validateSubmitReimbursement = [
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(REIMBURSEMENT_CATEGORIES)
        .withMessage(`Category must be one of: ${REIMBURSEMENT_CATEGORIES.join(', ')}`),

    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ min: 1, max: 1_000_000 }).withMessage('Amount must be between ₹1 and ₹10,00,000')
        .toFloat(),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 5, max: 500 }).withMessage('Description must be 5–500 characters'),

    body('expenseDate')
        .notEmpty().withMessage('Expense date is required')
        .isISO8601().withMessage('Expense date must be a valid date (YYYY-MM-DD)')
        .toDate()
        .custom((date) => {
            if (new Date(date) > new Date()) {
                throw new Error('Expense date cannot be in the future');
            }
            return true;
        }),

    body('receiptUrl')
        .optional({ checkFalsy: true })
        .trim()
        .isURL().withMessage('Receipt URL must be a valid URL'),

    validate,
];

const validateReimbursementStatus = [
    param('id')
        .isMongoId().withMessage('Invalid reimbursement ID'),

    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),

    body('reviewNote')
        .optional()
        .trim()
        .isLength({ max: 300 }).withMessage('Review note cannot exceed 300 characters'),

    validate,
];


const validateCreateUser = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['employee', 'manager', 'admin']).withMessage('Role must be employee, manager, or admin'),

    body('department')
        .optional()
        .trim()
        .isLength({ max: 60 }).withMessage('Department name too long'),

    validate,
];

const validateUpdateUser = [
    param('id')
        .isMongoId().withMessage('Invalid user ID'),

    body('role')
        .optional()
        .isIn(['employee', 'manager', 'admin']).withMessage('Role must be employee, manager, or admin'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be true or false'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),

    body('department')
        .optional()
        .trim()
        .isLength({ max: 60 }).withMessage('Department name too long'),

    validate,
];

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateApplyLeave,
    validateLeaveStatus,
    validateSubmitReimbursement,
    validateReimbursementStatus,
    validateCreateUser,
    validateUpdateUser,
};

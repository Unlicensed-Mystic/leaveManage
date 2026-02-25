const mongoose = require('mongoose');

const reimbursementSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            enum: ['travel', 'food', 'accommodation', 'medical', 'equipment', 'other'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        receiptUrl: {
            type: String,
            default: '',
        },
        expenseDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewNote: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Reimbursement', reimbursementSchema);

const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                'Food', 'Travel', 'Bills', 'Entertainment',
                'Health', 'Education', 'Shopping', 'Other',
            ],
        },
        limit: {
            type: Number,
            required: true,
            min: [1, 'Limit must be greater than 0'],
        },
        month: {
            type: String, // format: "2024-05"
            required: true,
        },
    },
    { timestamps: true }
);

// One budget per category per user per month
budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
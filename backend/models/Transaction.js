const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: [true, 'Type is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [1, 'Amount must be greater than 0'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: [
                'Food',
                'Travel',
                'Bills',
                'Entertainment',
                'Health',
                'Education',
                'Shopping',
                'Salary',
                'Freelance',
                'Other',
            ],
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
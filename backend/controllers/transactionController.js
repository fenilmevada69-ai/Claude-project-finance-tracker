const Transaction = require('../models/Transaction');

// ── CREATE TRANSACTION ─────────────────────────────────────
const createTransaction = async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body;

        const transaction = await Transaction.create({
            userId: req.user._id, // from middleware
            type,
            amount,
            category,
            description,
            date: date || Date.now(),
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── GET ALL TRANSACTIONS ───────────────────────────────────
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ date: -1 }); // newest first

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── GET SINGLE TRANSACTION ─────────────────────────────────
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Make sure user owns this transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── UPDATE TRANSACTION ─────────────────────────────────────
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Make sure user owns this transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updated = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // return updated document
        );

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── DELETE TRANSACTION ─────────────────────────────────────
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Make sure user owns this transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Transaction.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── GET SUMMARY ────────────────────────────────────────────
const getSummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id });

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpense;

        res.status(200).json({
            totalIncome,
            totalExpense,
            balance,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getSummary,
};
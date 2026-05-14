const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// ── SET OR UPDATE BUDGET ───────────────────────────────────
const setBudget = async (req, res) => {
    try {
        const { category, limit, month } = req.body;

        // Upsert — update if exists, create if not
        const budget = await Budget.findOneAndUpdate(
            { userId: req.user._id, category, month },
            { limit },
            { upsert: true, new: true }
        );

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── GET BUDGETS WITH SPENT AMOUNT ─────────────────────────
const getBudgets = async (req, res) => {
    try {
        const { month } = req.query;
        const currentMonth = month || new Date().toISOString().slice(0, 7);

        // Get all budgets for this month
        const budgets = await Budget.find({
            userId: req.user._id,
            month: currentMonth,
        });

        // Get all expenses for this month
        const startDate = new Date(`${currentMonth}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const transactions = await Transaction.find({
            userId: req.user._id,
            type: 'expense',
            date: { $gte: startDate, $lt: endDate },
        });

        // Calculate spent per category
        const result = budgets.map(budget => {
            const spent = transactions
                .filter(t => t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);

            const percentage = Math.round((spent / budget.limit) * 100);

            return {
                _id: budget._id,
                category: budget.category,
                limit: budget.limit,
                spent,
                percentage,
                status:
                    percentage >= 100 ? 'exceeded' :
                        percentage >= 80 ? 'warning' : 'safe',
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── DELETE BUDGET ──────────────────────────────────────────
const deleteBudget = async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Budget deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { setBudget, getBudgets, deleteBudget };
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

router.get('/budget-alerts', protect, async (req, res) => {
    try {
        const currentMonth = new Date().toISOString().slice(0, 7);

        const budgets = await Budget.find({
            userId: req.user._id,
            month: currentMonth,
        });

        const startDate = new Date(`${currentMonth}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const transactions = await Transaction.find({
            userId: req.user._id,
            type: 'expense',
            date: { $gte: startDate, $lt: endDate },
        });

        const alerts = [];

        for (const budget of budgets) {
            const spent = transactions
                .filter(t => t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);

            const percentage = Math.round((spent / budget.limit) * 100);

            if (percentage >= 80) {
                alerts.push({
                    category: budget.category,
                    spent,
                    limit: budget.limit,
                    percentage,
                    status: percentage >= 100 ? 'exceeded' : 'warning',
                    userEmail: req.user.email,
                    userName: req.user.name,
                });
            }
        }

        res.status(200).json({ alerts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAIInsights = async (req, res) => {
    try {
        // 1. Get last 30 days transactions
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const transactions = await Transaction.find({
            userId: req.user._id,
            date: { $gte: thirtyDaysAgo },
        }).sort({ date: -1 });

        if (transactions.length === 0) {
            return res.status(200).json({
                insights: ['Add some transactions first so I can analyse your spending patterns.'],
            });
        }

        // 2. Get budget goals
        const currentMonth = new Date().toISOString().slice(0, 7);
        const budgets = await Budget.find({
            userId: req.user._id,
            month: currentMonth,
        });

        // 3. Prepare summary for AI
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const categoryBreakdown = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        // 4. Build the prompt
        const prompt = `
You are an AI financial insights engine for an Indian personal finance tracker.

Your job is to analyse real financial behaviour and generate honest, data-driven insights.

You are NOT a motivational coach.
You are NOT overly positive.
Do not butter the user.
If financial behaviour is unhealthy, say it directly but politely.
Do not invent information not present in the data.
Do not assume investments, debt, or goals unless provided.

FINANCIAL DATA (LAST 30 DAYS)

Total Income: ₹${totalIncome}
Total Expense: ₹${totalExpense}
Remaining Balance: ₹${totalIncome - totalExpense}
Savings Rate: ${totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%

SPENDING BY CATEGORY (sorted highest to lowest)
${Object.entries(categoryBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amt]) => `- ${cat}: ₹${amt}`)
                .join('\n')}

MONTHLY BUDGET GOALS
${budgets.length > 0
                ? budgets.map(b => `- ${b.category}: limit ₹${b.limit}`).join('\n')
                : '- No budget goals set'}

RECENT TRANSACTIONS
${transactions
                .slice(0, 10)
                .map(t => `- ${t.type === 'income' ? '+' : '-'}₹${t.amount} | ${t.category} | ${t.description || 'No description'}`)
                .join('\n')}

WHAT TO ANALYSE
- Overspending or budget violations
- High category concentration
- Low savings rate
- Unusual or risky spending patterns
- Unnecessary recurring expenses
- Only mention positives if genuinely visible in the data

GOOD INSIGHT EXAMPLES
- "Food delivery is ₹4,800 this month — 22% of total expenses. Cutting it by 25% saves ₹1,200."
- "Savings rate is only 6%, leaving almost no emergency buffer."
- "Entertainment exceeded your budget by ₹2,300 this month."

BAD INSIGHT EXAMPLES (never say these)
- "Keep going!"
- "You're doing great!"
- "Consider saving more money." (without numbers)

RESPONSE RULES
1. Return ONLY a valid JSON array
2. Exactly 5 insights
3. Each insight is a plain string, max 2 sentences
4. Use ₹ amounts wherever relevant
5. No markdown, no code blocks, no extra text outside the array
6. Every insight must be based on the data provided above

["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"]
`;

        // 5. Call Gemini API
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.3,
                responseMimeType: 'application/json',
            },
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // 6. Parse response — JSON mode makes this clean
        let insights;
        try {
            insights = JSON.parse(text);
            // Safety check — ensure it's an array
            if (!Array.isArray(insights)) {
                insights = [text];
            }
        } catch {
            insights = [text];
        }

        res.status(200).json({ insights });

    } catch (error) {
        console.error('AI Error:', error.message);
        res.status(500).json({ message: 'AI analysis failed. Try again.' });
    }
};

module.exports = { getAIInsights };
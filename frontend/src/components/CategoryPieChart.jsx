import {
    PieChart, Pie, Cell,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = [
    '#6366F1', '#10B981', '#F59E0B', '#EF4444',
    '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6',
    '#F97316', '#64748B',
];

const CategoryPieChart = ({ transactions }) => {
    // Group expenses by category
    const data = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const existing = acc.find(item => item.name === t.category);
            if (existing) {
                existing.value += t.amount;
            } else {
                acc.push({ name: t.category, value: t.amount });
            }
            return acc;
        }, []);

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center h-64 text-gray-400">
                No expense data yet 📊
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                🥧 Spending by Category
            </h3>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryPieChart;
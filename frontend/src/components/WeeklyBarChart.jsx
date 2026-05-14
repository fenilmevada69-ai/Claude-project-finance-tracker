import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const WeeklyBarChart = ({ transactions }) => {
    // Get last 7 days
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({
                date: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
                income: 0,
                expense: 0,
            });
        }
        return days;
    };

    const data = getLast7Days();

    // Fill in actual values
    transactions.forEach(t => {
        const tDate = new Date(t.date).toISOString().split('T')[0];
        const day = data.find(d => d.date === tDate);
        if (day) {
            if (t.type === 'income') day.income += t.amount;
            if (t.type === 'expense') day.expense += t.amount;
        }
    });

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                📊 Last 7 Days
            </h3>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        tickFormatter={(v) => `₹${v}`}
                    />
                    <Tooltip
                        formatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyBarChart;
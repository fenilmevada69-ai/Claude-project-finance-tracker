const SummaryCards = ({ summary }) => {
    const cards = [
        {
            label: 'Total Income',
            value: summary.totalIncome,
            color: 'bg-green-100 text-green-700',
            icon: '💰',
        },
        {
            label: 'Total Expense',
            value: summary.totalExpense,
            color: 'bg-red-100 text-red-700',
            icon: '💸',
        },
        {
            label: 'Balance',
            value: summary.balance,
            color: 'bg-indigo-100 text-indigo-700',
            icon: '🏦',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className={`rounded-2xl p-5 shadow-sm ${card.color}`}
                >
                    <div className="text-3xl mb-2">{card.icon}</div>
                    <p className="text-sm font-medium opacity-75">{card.label}</p>
                    <p className="text-2xl font-bold mt-1">
                        ₹{card.value?.toLocaleString() || 0}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
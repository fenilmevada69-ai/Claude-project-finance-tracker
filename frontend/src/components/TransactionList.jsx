import { deleteTransaction } from '../api/axios';

const CATEGORY_COLORS = {
    Food: 'bg-orange-100 text-orange-600',
    Travel: 'bg-blue-100 text-blue-600',
    Bills: 'bg-red-100 text-red-600',
    Entertainment: 'bg-purple-100 text-purple-600',
    Health: 'bg-green-100 text-green-600',
    Education: 'bg-yellow-100 text-yellow-600',
    Shopping: 'bg-pink-100 text-pink-600',
    Salary: 'bg-emerald-100 text-emerald-600',
    Freelance: 'bg-cyan-100 text-cyan-600',
    Other: 'bg-gray-100 text-gray-600',
};

const TransactionList = ({ transactions, onTransactionDeleted }) => {
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return;
        try {
            await deleteTransaction(id);
            onTransactionDeleted();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-400">
                No transactions yet. Add your first one above! 💸
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                📋 Recent Transactions
            </h3>

            <div className="space-y-3">
                {transactions.map((t) => (
                    <div
                        key={t._id}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
                    >
                        {/* Left side */}
                        <div className="flex items-center gap-3">
                            <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${CATEGORY_COLORS[t.category]}`}
                            >
                                {t.category}
                            </span>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    {t.description || t.category}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(t.date).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            <span
                                className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-500'
                                    }`}
                            >
                                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                            </span>
                            <button
                                onClick={() => handleDelete(t._id)}
                                className="text-gray-300 hover:text-red-500 transition text-lg"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
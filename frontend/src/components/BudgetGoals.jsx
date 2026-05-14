import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import API from '../api/axios';

const CATEGORIES = [
    'Food', 'Travel', 'Bills', 'Entertainment',
    'Health', 'Education', 'Shopping', 'Other',
];

const STATUS_STYLES = {
    safe: 'bg-green-500',
    warning: 'bg-yellow-400',
    exceeded: 'bg-red-500',
};

const BudgetGoals = () => {
    const [budgets, setBudgets] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const currentMonth = new Date().toISOString().slice(0, 7);

    const fetchBudgets = async () => {
        try {
            const res = await API.get(`/budgets?month=${currentMonth}`);
            setBudgets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const onSubmit = async (data) => {
        try {
            await API.post('/budgets', {
                ...data,
                limit: Number(data.limit),
                month: currentMonth,
            });
            reset();
            setShowForm(false);
            fetchBudgets();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to set budget');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this budget goal?')) return;
        try {
            await API.delete(`/budgets/${id}`);
            fetchBudgets();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                    🎯 Budget Goals — {currentMonth}
                </h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Set Budget'}
                </button>
            </div>

            {/* Add Budget Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex gap-3 mb-4 p-4 bg-gray-50 rounded-xl"
                >
                    <select
                        {...register('category', { required: true })}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">Category</option>
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <input
                        {...register('limit', { required: true, min: 1 })}
                        type="number"
                        placeholder="Limit (₹)"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                    >
                        Save
                    </button>
                </form>
            )}

            {/* Budget List */}
            {budgets.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                    No budget goals set for this month.
                </p>
            ) : (
                <div className="space-y-4">
                    {budgets.map(budget => (
                        <div key={budget._id}>
                            {/* Header */}
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {budget.category}
                                    </span>
                                    {budget.status === 'exceeded' && (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                                            Exceeded!
                                        </span>
                                    )}
                                    {budget.status === 'warning' && (
                                        <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full font-semibold">
                                            Almost there!
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">
                                        ₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(budget._id)}
                                        className="text-gray-300 hover:text-red-500 transition text-sm"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full transition-all ${STATUS_STYLES[budget.status]}`}
                                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                {budget.percentage}% used
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BudgetGoals;
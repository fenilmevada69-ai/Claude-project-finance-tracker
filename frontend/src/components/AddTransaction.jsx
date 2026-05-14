import { useForm } from 'react-hook-form';
import { createTransaction } from '../api/axios';

const CATEGORIES = [
    'Food', 'Travel', 'Bills', 'Entertainment',
    'Health', 'Education', 'Shopping', 'Salary',
    'Freelance', 'Other',
];

const AddTransaction = ({ onTransactionAdded }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await createTransaction({
                ...data,
                amount: Number(data.amount),
            });
            reset();
            onTransactionAdded(); // refresh list + summary
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add transaction');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                ➕ Add Transaction
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Type */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Type
                        </label>
                        <select
                            {...register('type', { required: 'Type is required' })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="">Select type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        {errors.type && (
                            <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Amount (₹)
                        </label>
                        <input
                            {...register('amount', {
                                required: 'Amount is required',
                                min: { value: 1, message: 'Must be greater than 0' },
                            })}
                            type="number"
                            placeholder="500"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {errors.amount && (
                            <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
                        )}
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Category
                    </label>
                    <select
                        {...register('category', { required: 'Category is required' })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">Select category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Description (optional)
                    </label>
                    <input
                        {...register('description')}
                        placeholder="Lunch at canteen"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Date
                    </label>
                    <input
                        {...register('date')}
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Add Transaction
                </button>
            </form>
        </div>
    );
};

export default AddTransaction;
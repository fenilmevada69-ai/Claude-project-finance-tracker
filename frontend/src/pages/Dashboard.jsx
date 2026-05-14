import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTransactions, getSummary } from '../api/axios';
import SummaryCards from '../components/SummaryCards';
import AddTransaction from '../components/AddTransaction';
import TransactionList from '../components/TransactionList';
import CategoryPieChart from '../components/CategoryPieChart';
import WeeklyBarChart from '../components/WeeklyBarChart';
import BudgetGoals from '../components/BudgetGoals';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [txRes, sumRes] = await Promise.all([
                getTransactions(),
                getSummary(),
            ]);
            setTransactions(txRes.data);
            setSummary(sumRes.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-indigo-600">💰 SmartSpend</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">Hi, {user?.name} 👋</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center text-gray-400 py-20 text-lg">
                        Loading your data...
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <SummaryCards summary={summary} />

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <CategoryPieChart transactions={transactions} />
                            <WeeklyBarChart transactions={transactions} />
                        </div>

                        {/* Budget Goals */}
                        <BudgetGoals />

                        {/* Add Transaction */}
                        <AddTransaction onTransactionAdded={fetchData} />

                        {/* Transaction List */}
                        <TransactionList
                            transactions={transactions}
                            onTransactionDeleted={fetchData}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
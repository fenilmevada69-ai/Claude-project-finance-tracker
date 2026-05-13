import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Welcome, {user?.name}! 👋
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Your personal finance dashboard
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
                    <p className="text-gray-400 text-center">
                        Dashboard coming soon — transactions, charts and AI insights will live here 🚀
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
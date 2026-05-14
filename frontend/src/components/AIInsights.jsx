import { useState } from 'react';
import API from '../api/axios';

const AIInsights = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    const generateInsights = async () => {
        setLoading(true);
        try {
            const res = await API.get('/ai/insights');
            setInsights(res.data.insights);
            setGenerated(true);
        } catch (err) {
            alert('Failed to generate insights. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const ICONS = ['💡', '📊', '⚠️', '🎯', '💰'];

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                        🤖 AI Financial Insights
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Powered by Gemini AI — analyses your last 30 days
                    </p>
                </div>
                <button
                    onClick={generateInsights}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '🔄 Analysing...' : generated ? '🔁 Refresh' : '✨ Generate Insights'}
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className="h-12 bg-gray-100 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Insights */}
            {!loading && generated && (
                <div className="space-y-3">
                    {insights.map((insight, index) => (
                        <div
                            key={index}
                            className="flex gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100"
                        >
                            <span className="text-xl flex-shrink-0">
                                {ICONS[index] || '💡'}
                            </span>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {insight}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && !generated && (
                <div className="text-center py-8 text-gray-400">
                    <p className="text-4xl mb-3">🤖</p>
                    <p className="text-sm">
                        Click "Generate Insights" to get personalised AI analysis of your spending
                    </p>
                </div>
            )}
        </div>
    );
};

export default AIInsights;
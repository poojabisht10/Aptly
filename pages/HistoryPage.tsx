
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as firestoreService from '../services/firestoreService';
import { FullAnalysis } from '../types';
import Spinner from '../components/ui/Spinner';

const HistoryItem: React.FC<{ item: FullAnalysis }> = ({ item }) => {
    const scoreColor = item.matchScore >= 75 ? 'text-green-500' : item.matchScore >= 50 ? 'text-yellow-500' : 'text-red-500';
    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div>
                <p className="font-semibold text-lg">{item.jobTitle || 'Untitled Analysis'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                </p>
            </div>
            <div className={`text-2xl font-bold ${scoreColor}`}>
                {item.matchScore}%
            </div>
        </div>
    );
};

const HistoryPage: React.FC = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<FullAnalysis[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const userHistory = await firestoreService.getHistory(user.uid);
                setHistory(userHistory);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Analysis History</h1>
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <Spinner className="w-10 h-10" />
                </div>
            )}
            {!loading && history.length === 0 && (
                <div className="text-center py-10 px-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h2 className="text-xl font-semibold">No History Found</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Analyze a resume on the dashboard to get started!</p>
                </div>
            )}
            {!loading && history.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {history.map((item) => <HistoryItem key={item.id} item={item} />)}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;

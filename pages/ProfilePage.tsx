
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
    const { user, auth } = useAuth();

    if (!user || !auth) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-semibold">{user.isAnonymous ? "Anonymous User" : user.email}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</p>
                    <p className="font-semibold break-all">{user.uid}</p>
                </div>
            </div>
            <button
                onClick={() => auth.signOut()}
                className="w-full mt-8 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
                Sign Out
            </button>
        </div>
    );
};

export default ProfilePage;

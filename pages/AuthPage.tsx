
import React from 'react';
import Spinner from '../components/ui/Spinner';

const AuthPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-500">Welcome to Aptly</h1>
            <p className="text-xl mt-4 text-gray-600 dark:text-gray-400">Please wait while we prepare your session...</p>
            <div className="mt-8">
                <Spinner className="w-12 h-12" />
            </div>
        </div>
    );
};

export default AuthPage;

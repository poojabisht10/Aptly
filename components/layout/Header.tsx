
import React from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { Page } from '../../types';

interface HeaderProps {
    currentPage: Page;
    setPage: (page: Page) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const NavLink: React.FC<{
    pageName: Page;
    currentPage: Page;
    setPage: (page: Page) => void;
    children: React.ReactNode;
}> = ({ pageName, currentPage, setPage, children }) => {
    const isActive = currentPage === pageName;
    const activeClasses = 'font-bold text-blue-600 dark:text-blue-400';
    const inactiveClasses = 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400';

    return (
        <button
            onClick={() => setPage(pageName)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeClasses : inactiveClasses}`}
        >
            {children}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ currentPage, setPage, theme, setTheme }) => {
    return (
        <header className="bg-white/80 dark:bg-gray-800/80 shadow-md sticky top-0 z-40 backdrop-filter backdrop-blur-lg">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                        Aptly
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <NavLink pageName="dashboard" currentPage={currentPage} setPage={setPage}>Dashboard</NavLink>
                        <NavLink pageName="history" currentPage={currentPage} setPage={setPage}>History</NavLink>
                        <NavLink pageName="profile" currentPage={currentPage} setPage={setPage}>Profile</NavLink>
                        <ThemeToggle theme={theme} setTheme={setTheme} />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;

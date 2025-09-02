
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import Toast from './components/ui/Toast';
import PaymentModal from './components/modals/PaymentModal';
import { ToastState, Page } from './types';

const App: React.FC = () => {
    const { user } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('aptly-theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });
    const [page, setPage] = useState<Page>('dashboard');
    const [toast, setToast] = useState<ToastState>({ message: '', type: 'success' });
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [onPaymentSuccess, setOnPaymentSuccess] = useState<(() => void) | null>(null);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            localStorage.setItem('aptly-theme', theme);
        } catch (error) {
            console.error("Could not save theme to localStorage:", error);
        }
    }, [theme]);

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    }, []);

    const triggerPayment = useCallback((callback: () => void) => {
        setOnPaymentSuccess(() => callback);
        setShowPaymentModal(true);
    }, []);
    
    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        if (onPaymentSuccess) {
            onPaymentSuccess();
        }
        showToast("Payment successful!", "success");
    };

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
    };

    if (!user) {
        return <AuthPage />;
    }

    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return <DashboardPage showToast={showToast} triggerPayment={triggerPayment} />;
            case 'history':
                return <HistoryPage />;
            case 'profile':
                return <ProfilePage />;
            default:
                return <DashboardPage showToast={showToast} triggerPayment={triggerPayment} />;
        }
    };

    return (
        <div className="min-h-screen">
            <Header currentPage={page} setPage={setPage} theme={theme} setTheme={handleThemeChange} />
            <main className="container mx-auto p-4 md:p-8">
                {renderPage()}
            </main>
            <PaymentModal 
                show={showPaymentModal} 
                onPay={handlePaymentSuccess} 
                onCancel={() => setShowPaymentModal(false)} 
            />
            {toast.message && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onHide={() => setToast({ message: '', type: 'success' })} 
                />
            )}
        </div>
    );
};

export default App;

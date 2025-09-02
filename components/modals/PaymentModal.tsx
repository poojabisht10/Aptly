
import React, { useState } from 'react';
import Spinner from '../ui/Spinner';

interface PaymentModalProps {
    show: boolean;
    onPay: () => void;
    onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ show, onPay, onCancel }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!show) return null;

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate network request
        setTimeout(() => {
            onPay();
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <div className="modal-backdrop">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center transform transition-all" role="dialog" aria-modal="true">
                <h2 className="text-2xl font-bold mb-2">Unlock Your Download</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">A small fee helps us keep this service running.</p>
                <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
                    <p className="text-lg font-medium">Total Amount</p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">₹50</p>
                </div>
                <button 
                    onClick={handlePayment} 
                    disabled={isProcessing} 
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center transition-colors"
                >
                    {isProcessing ? <Spinner className="w-6 h-6 border-2 border-t-white" /> : 'Pay Now'}
                </button>
                <button onClick={onCancel} className="w-full mt-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PaymentModal;

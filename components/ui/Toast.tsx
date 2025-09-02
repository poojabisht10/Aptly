
import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onHide }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                // Allow time for fade-out animation before calling onHide
                setTimeout(onHide, 300);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onHide]);
    
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    
    return (
        <div className={`toast p-3 rounded-lg text-white shadow-lg ${bgColor} ${visible ? 'show' : ''}`}>
            {message}
        </div>
    );
};

export default Toast;

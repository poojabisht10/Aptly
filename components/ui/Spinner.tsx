
import React from 'react';

interface SpinnerProps {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = 'w-6 h-6' }) => {
    return <div className={`spinner ${className}`}></div>;
};

export default Spinner;

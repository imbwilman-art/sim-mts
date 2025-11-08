import React from 'react';

export const QrcodeIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h1v1H4zM4 9h1v1H4zM9 4h1v1H9zM9 9h1v1H9zM4 14h1v1H4zM9 14h1v1H9zM14 4h1v1h-1zM14 9h1v1h-1zM19 4h1v1h-1zM19 9h1v1h-1zM14 14h1v1h-1zM19 14h1v1h-1zM4 19h1v1H4zM9 19h1v1H9zM14 19h1v1h-1zM19 19h1v1h-1z" />
    </svg>
);
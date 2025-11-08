
import React from 'react';

export const PrinterIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 10V5a2 2 0 012-2h8a2 2 0 012 2v5M6 10H4a2 2 0 00-2 2v5a2 2 0 002 2h16a2 2 0 002-2v-5a2 2 0 00-2-2h-2M6 10h12M12 18v-3" />
    </svg>
);

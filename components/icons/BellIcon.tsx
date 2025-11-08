import React from 'react';

export const BellIcon: React.FC<{ className?: string, solid?: boolean }> = ({ className = "h-5 w-5", solid = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        {solid ? (
            <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        ) : (
            <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM8.293 16.707a1 1 0 011.414-1.414A3 3 0 0113 16h-1.768a3 3 0 01-2.939.707zM12 8a2 2 0 10-4 0v3.586l-1.293 1.293A1 1 0 108 14h4a1 1 0 101.293-1.121L12 11.586V8z" clipRule="evenodd" />
        )}
    </svg>
);

import React from 'react';

export const BellAlertIcon: React.FC<{className?: string}> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.375 17.55A5.992 5.992 0 0112 19.5a5.992 5.992 0 01-3.375-1.95M15.375 17.55A5.992 5.992 0 0012 15.5a5.992 5.992 0 00-3.375 2.05m6.75 0c.09.09.172.19.25.295M8.625 17.55c-.09.09-.172.19-.25.295m6.75-2.05a5.992 5.992 0 01-3.375-2.05m0 0A5.992 5.992 0 0112 13.5a5.992 5.992 0 013.375 2.05m-6.75 0a5.992 5.992 0 00-3.375-2.05m11.25 4.345c.394.394.81.757 1.25 1.095M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a9.75 9.75 0 01-8.217-4.423 9.75 9.75 0 0116.434 0 9.75 9.75 0 01-8.217 4.423z" />
    </svg>
);

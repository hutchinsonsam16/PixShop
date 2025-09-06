/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect } from 'react';
import { useStore } from '../state/store';
import { CloseIcon } from './icons';

const Toast: React.FC = () => {
    const { error, setError } = useStore();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [error, setError]);

    if (!error) {
        return null;
    }

    return (
        <div 
            className="fixed top-28 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-red-800/90 border border-red-600 text-white rounded-lg shadow-2xl z-[100] backdrop-blur-sm animate-fade-in"
            role="alert"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {/* Alert Icon */}
                    <svg className="w-6 h-6 text-red-300" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-semibold text-red-200">An Error Occurred</p>
                    <p className="mt-1 text-sm text-red-300">{error.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        onClick={() => setError(null)}
                        className="inline-flex text-red-300 rounded-md p-1 hover:bg-red-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-800 focus:ring-white"
                        aria-label="Dismiss"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
"use client";

import React from "react";

interface AuthTabsProps {
    isLogin: boolean;
    isLoading: boolean;
    onToggleMode: () => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ isLogin, isLoading, onToggleMode }) => {
    return (
        <div className="mt-6">
            <div className="grid w-full grid-cols-2 rounded-lg bg-gray-100 p-1">
                <button
                    type="button"
                    disabled={isLoading}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isLogin
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => onToggleMode()}
                >
                    Login
                </button>
                <button
                    type="button"
                    disabled={isLoading}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${!isLogin
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => onToggleMode()}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

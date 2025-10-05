"use client";

import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-full flex-1 h-[100vh]">
            <div className="relative w-0 flex-1 lg:block">
                <img
                    className="absolute inset-0 h-full w-full object-cover bg-[#f6f6f6]"
                    src="https://www.mybranz.com/images/art/best.svg"
                    alt="Background illustration"
                />
            </div>
            <div className="flex flex-1 min-w-[30%] flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="flex justify-start">
                        <img
                            className="w-28 text-center"
                            src="/black-logo-full.png"
                            alt="Company logo"
                        />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

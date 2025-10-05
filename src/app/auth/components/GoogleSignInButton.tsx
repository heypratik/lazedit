"use client";

import React from "react";
import Image from "next/image";
import { RiLoader4Fill } from "react-icons/ri";

interface GoogleSignInButtonProps {
    isLoading: boolean;
    redirect: boolean;
    onGoogleSignIn: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
    isLoading,
    redirect,
    onGoogleSignIn,
}) => {
    return (
        <>
            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with Google</span>
                </div>
            </div>

            {/* Google Sign-in Button */}
            <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={isLoading || redirect}
                className="flex w-full justify-center items-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? (
                    <RiLoader4Fill fontSize={20} className="spinner" />
                ) : (
                    <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                        alt="Google Logo"
                        width={20}
                        height={20}
                        className="h-5 w-5"
                    />
                )}
                {isLoading ? "Signing in..." : "Continue with Google"}
            </button>
        </>
    );
};

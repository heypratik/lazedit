"use client";

import React from "react";
import { RiLoader4Fill, RiCheckFill } from "react-icons/ri";
import { AuthFormData } from "../hooks/useAuth";

interface AuthFormProps {
    isLogin: boolean;
    isLoading: boolean;
    redirect: boolean;
    formData: AuthFormData;
    onFieldChange: (field: keyof AuthFormData, value: string) => void;
    onSubmit: () => void;
    onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
    isLogin,
    isLoading,
    redirect,
    formData,
    onFieldChange,
    onSubmit,
    onToggleMode,
}) => {
    const inputStyles =
        "block w-full rounded-md border-2 border-gray-300 focus:border-[#f23251] p-2 ring-0 ring-inset ring-[#f23251] placeholder:text-gray-400 sm:text-sm sm:leading-6";

    return (
        <div className="mt-10">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {!isLogin && (
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Full Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className={inputStyles}
                                value={formData.name || ""}
                                onChange={(e) => onFieldChange("name", e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Email address
                    </label>
                    <div className="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className={inputStyles}
                            value={formData.email}
                            onChange={(e) => onFieldChange("email", e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className={inputStyles}
                            value={formData.password}
                            onChange={(e) => onFieldChange("password", e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            className="pl-1 font-bold text-[#000] underline"
                            onClick={() => onToggleMode()}
                        >
                            {isLogin ? "Sign up" : "Login"}
                        </button>
                    </p>
                </div>

                <button
                    type="button"
                    className="flex w-full justify-center rounded-md bg-[#000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000] items-center gap-2 disabled:cursor-not-allowed"
                    onClick={() => onSubmit()}
                    disabled={isLoading || redirect}
                >
                    {redirect ? (
                        <>
                            <RiCheckFill fontSize={20} />
                            Redirecting
                        </>
                    ) : (
                        <>
                            {isLogin ? "Login" : "Sign up"}
                            {isLoading && (
                                <RiLoader4Fill fontSize={20} className="spinner" />
                            )}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

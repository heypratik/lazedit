"use client";

import React, { useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { AuthLayout, AuthTabs, AuthForm, GoogleSignInButton } from "./components";
import { useAuth, useAuthForm } from "./hooks";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const { isLoading, isGoogleLoading, redirect, handleEmailAuth, handleGoogleSignIn } = useAuth();
    const { formData, updateField } = useAuthForm(isLogin);

    const handleToggleMode = useCallback(() => {
        setIsLogin(!isLogin);
    }, [isLogin]);

    const handleSubmit = useCallback(() => {
        handleEmailAuth(formData, isLogin);
    }, [formData, isLogin, handleEmailAuth]);

    const handleFieldChange = useCallback((field: keyof typeof formData, value: string) => {
        updateField(field, value);
    }, [updateField]);

    return (
        <>
            <Toaster />
            <AuthLayout>
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {isLogin ? "Welcome back!" : "Create your account"}
                </h2>

                <AuthTabs
                    isLogin={isLogin}
                    isLoading={isLoading}
                    onToggleMode={handleToggleMode}
                />

                <AuthForm
                    isLogin={isLogin}
                    isLoading={isLoading}
                    redirect={redirect}
                    formData={formData}
                    onFieldChange={handleFieldChange}
                    onSubmit={handleSubmit}
                    onToggleMode={handleToggleMode}
                />

                <GoogleSignInButton
                    isLoading={isGoogleLoading}
                    redirect={redirect}
                    onGoogleSignIn={handleGoogleSignIn}
                />
            </AuthLayout>
        </>
    );
}

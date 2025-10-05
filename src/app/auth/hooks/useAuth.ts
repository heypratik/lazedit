"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";

export interface AuthFormData {
    email: string;
    password: string;
    name?: string;
}

export const useAuth = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const notification = useCallback((success: boolean, message: string) => {
        if (success) {
            toast.success(message);
        } else {
            toast.error(message || "An error occurred");
        }
    }, []);

    const handleEmailAuth = useCallback(async (formData: AuthFormData, isLogin: boolean) => {
        setIsLoading(true);
        try {
            if (isLogin) {
                const { data, error } = await signIn.email({
                    email: formData.email,
                    password: formData.password,
                });

                if (data) {
                    setRedirect(true);
                    router.push("/dashboard");
                    notification(true, "Login Successful");
                } else {
                    notification(false, error?.message || "Login failed");
                }
            } else {
                await handleSignup(formData);
            }
        } catch (error) {
            notification(false, "An error occurred");
        }
        setIsLoading(false);
    }, [router, notification]);

    const handleSignup = useCallback(async (formData: AuthFormData) => {
        try {
            const { data, error } = await signUp.email({
                name: formData.name!,
                email: formData.email,
                password: formData.password,
            });

            if (data) {
                notification(true, "Signup Successful");

                // Auto login after signup
                const { data: loginData, error: loginError } = await signIn.email({
                    email: formData.email,
                    password: formData.password,
                });

                if (loginData) {
                    setRedirect(true);
                    router.push("/dashboard");
                    notification(true, "Login Successful");
                } else {
                    notification(false, loginError?.message || "Auto-login failed");
                }
            } else {
                notification(false, error?.message || "Signup Failed");
            }
        } catch (error) {
            notification(false, "An error occurred during signup");
        }
    }, [router, notification]);

    const handleGoogleSignIn = useCallback(async () => {
        setIsGoogleLoading(true);
        try {
            const { data, error } = await signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });

            if (data) {
                setRedirect(true);
                router.push("/dashboard");
                notification(true, "Google sign-in successful");
            } else {
                notification(false, error?.message || "Google sign-in failed");
            }
        } catch (error) {
            notification(false, "An error occurred during Google sign-in");
        }
        setIsGoogleLoading(false);
    }, [router, notification]);

    return {
        isLoading,
        isGoogleLoading,
        redirect,
        handleEmailAuth,
        handleGoogleSignIn,
    };
};

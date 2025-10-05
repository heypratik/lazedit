"use client";

import { useState, useCallback, useEffect } from "react";
import { AuthFormData } from "./useAuth";

export const useAuthForm = (isLogin: boolean) => {
    const [formData, setFormData] = useState<AuthFormData>({
        email: "",
        password: "",
        name: "",
    });

    const updateField = useCallback((field: keyof AuthFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            email: "",
            password: "",
            name: "",
        });
    }, []);

    const handleEnterPress = useCallback((event: KeyboardEvent, submitFunction: () => void) => {
        if (event.key === "Enter") {
            event.preventDefault();
            submitFunction();
        }
    }, []);

    // Add event listener for Enter key
    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleKeyDown = (event: KeyboardEvent) => {
                handleEnterPress(event, () => {
                    // This will be handled by the parent component
                });
            };

            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [handleEnterPress]);

    return {
        formData,
        updateField,
        resetForm,
        handleEnterPress,
    };
};

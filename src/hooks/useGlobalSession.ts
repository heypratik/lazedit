"use client";

import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";

export const useGlobalSession = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error("useGlobalSession must be used within a GlobalProvider");
    }

    return {
        session: context.session,
        sessionLoading: context.sessionLoading,
        isAuthenticated: context.isAuthenticated,
        user: context.user,
    };
};

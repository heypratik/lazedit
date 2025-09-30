"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface SessionContextType {
    session: any;
    isLoading: boolean;
    isAuthenticated: boolean;
    user: any;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, isPending: isLoading } = useSession();

    const contextValue: SessionContextType = {
        session,
        isLoading,
        isAuthenticated: !!session,
        user: session?.user || null,
    };

    return (
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSessionContext must be used within a SessionProvider");
    }
    return context;
};

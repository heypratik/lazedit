"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSessionContext } from "./SessionProvider";

interface GlobalContextType {
    session: any;
    sessionLoading: boolean;
    isAuthenticated: boolean;
    user: any;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const { session, isLoading: sessionLoading, isAuthenticated, user } = useSessionContext();

    const contextValue: GlobalContextType = {
        session,
        sessionLoading,
        isAuthenticated,
        user,
    };

    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }
    return context;
};

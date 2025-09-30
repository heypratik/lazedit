"use client";

import { createContext } from "react";
import { useSessionContext } from "./SessionProvider";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

  // Global session for client side use
  const { session, isLoading: sessionLoading, isAuthenticated, user } = useSessionContext();
  

  return (
    <GlobalContext.Provider
      value={{
        session,
        sessionLoading,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

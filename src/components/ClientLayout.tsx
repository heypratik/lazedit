"use client";

import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { GlobalProvider } from "@/context/GlobalContext";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Providers from "./providers";

const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <SessionProvider>
          <GlobalProvider>
            <Toaster />
            <Modals />
            {children}
          </GlobalProvider>
        </SessionProvider>
      </QueryClientProvider>
    </Providers>
  );
}

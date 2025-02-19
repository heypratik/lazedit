"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
// import "bootstrap/dist/css/bootstrap.min.css";
import { GlobalProvider } from "@/context/GlobalContext";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Providers from "../components/providers";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}

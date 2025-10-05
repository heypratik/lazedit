"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

export default function DemoPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const autoLoginDemo = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const demoCredentials = {
                    email: "demo@gmail.com",
                    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD
                };

                const { data, error: signInError } = await signIn.email({
                    email: demoCredentials.email,
                    password: demoCredentials.password!,
                });

                if (data) {
                    toast.success("Demo login successful!");
                    router.push("/demo/da9b1b83-97a7-4e92-b4b5-1ff29342d5f1");
                } else {
                    setError(signInError?.message || "Demo login failed");
                    toast.error("Demo login failed. Please try again.");
                }
            } catch (err) {
                setError("An error occurred during demo login");
                toast.error("An error occurred during demo login");
                console.error("Demo login error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        autoLoginDemo();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader className="size-6 animate-spin text-muted-foreground" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Demo</h2>
                    <p className="text-gray-600">Please wait while we log you in to the demo.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">Demo Login Failed</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                    <p className="text-gray-600">
                        If the problem persists, please contact support.
                    </p>
                </div>
            </div>
        );
    }

    return null;
}

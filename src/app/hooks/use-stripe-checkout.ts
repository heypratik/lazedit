"use client";

import { useState } from "react";
import { stripe } from "../utlis/stripe";

// Define types for Stripe checkout session
interface StripeCheckoutSession {
    url?: string;
    id: string;
}

// Define the hook return type
interface UseStripeCheckoutReturn {
    createCheckoutSession: (planId: string, customer: string) => Promise<void>;
    loadingSession: boolean;
}

export const useStripeCheckout = (): UseStripeCheckoutReturn => {
    const [loadingSession, setLoadingSession] = useState<boolean>(false);

    const createCheckoutSession = async (planId: string, customer: string): Promise<void> => {
        setLoadingSession(true);

        try {
            const session: StripeCheckoutSession = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: planId, // Your price ID
                        quantity: 1,
                    },
                ],
                mode: "subscription", // For recurring charges
                // subscription_data: { trial_period_days: 7 },
                success_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/billing`,
                cancel_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/billing`,
                customer: customer,
                allow_promotion_codes: true,
            });

            if (session.url) {
                window.location.href = session.url;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSession(false);
        }
    };

    return { createCheckoutSession, loadingSession };
};

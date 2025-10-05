"use client";

import { useState } from 'react';
import { stripe } from '../utlis/stripe';

// Define types for Stripe billing portal session
interface StripeBillingPortalSession {
    url?: string;
    id: string;
}

// Define the hook return type
interface UseStripePortalReturn {
    createBillingPortal: (customer: string) => Promise<void>;
    loadingPortal: boolean;
}

export const useStripePortal = (): UseStripePortalReturn => {
    const [loadingPortal, setLoadingPortal] = useState<boolean>(false);

    const createBillingPortal = async (customer: string): Promise<void> => {
        setLoadingPortal(true);

        try {
            const session: StripeBillingPortalSession = await stripe.billingPortal.sessions.create({
                customer: customer,
                return_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/billing`,
            });

            if (session.url) {
                window.open(session.url, '_blank');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingPortal(false);
        }
    };

    return { createBillingPortal, loadingPortal };
};

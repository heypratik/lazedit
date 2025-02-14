"use client";

import { useState } from "react";
import { stripe } from "../utlis/stripe";

export const useStripeCheckout = () => {
  const [loadingSession, setLoadingSession] = useState(false);

  const createCheckoutSession = async (planId, customer) => {
    setLoadingSession(true);

    try {
      const session = await stripe.checkout.sessions.create({
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

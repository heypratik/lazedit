"use client"

import { useState } from 'react';
import { stripe } from '../utlis/stripe'

export const useStripePortal = () => {
  const [loadingPortal, setLoadingPortal] = useState(false);

  const createBillingPortal = async (customer) => {

    setLoadingPortal(true);

    try {
        const session = await stripe.billingPortal.sessions.create({
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

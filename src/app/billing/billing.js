"use client";

import CustomLayout from "../layout/layout";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useStripeCheckout } from "../hooks/use-stripe-checkout";
import { useStripePortal } from "../hooks/use-stripe-portal";
import { Button } from "../layout/button";
import { FiExternalLink } from "react-icons/fi";
import Profile from "./profile";

const Billing = ({ session, user }) => {
  const [stripePlan, setStripePlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { createCheckoutSession, loadingSession } = useStripeCheckout();
  const { createBillingPortal, loadingPortal } = useStripePortal();

  const plans = [
    // {
    //     id: 1,
    //     name: 'Essential',
    //     monthly_plan_id: 'price_1QL5scGvRrdKx7JCh3SQaPqX',
    //     yearly_plan_id: 'price_1QL5vkGvRrdKx7JC64FFLE9Y',
    //     monthly_price: 129,
    //     yearly_price: 1032,
    //     features: ['Send up to 2 emails and 4 social posts per month', 'AI-powered email generation and scheduling', 'Custom segmentation for each campaign'],
    //     trial: 7,
    // },
    {
      id: 2,
      name: "Individual",
      monthly_plan_id: "price_1RjMLLC3lVSKOiCb8vqRm7dd",
      yearly_plan_id: "price_1RjMMwC3lVSKOiCbgwgWV09h",
      monthly_price: 16,
      yearly_price: 165,
      features: [
        "✅ 350 AI image edits per month",
        "⚡ All AI editing features",
        "📸 High-resolution exports",
        "🚀 Priority processing",
        "🔧 Custom integrations",
      ],
      trial: 0,
    },
    {
      id: 3,
      name: "Teams",
      monthly_plan_id: "price_1RjMLyC3lVSKOiCbd7qrMrxt",
      yearly_plan_id: "price_1RjMNCC3lVSKOiCbt2CogAJt",
      monthly_price: 59,
      yearly_price: 649,
      features: [
        "♾️ 5X more image edits",
        "🤝 Team collaboration tools",
        "⚙️ API access",
        "💬 Priority support",
        "🔧 Custom integrations",
      ],
      trial: 0,
    },
  ];

  async function handleStripePlan(plan) {
    if (billingCycle === "monthly") {
      setStripePlan(plan.monthly_plan_id);
      try {
        await createCheckoutSession(
          plan.monthly_plan_id,
          user?.stripeCustomerId
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      setStripePlan(plan.yearly_plan_id);
      try {
        await createCheckoutSession(
          plan.yearly_plan_id,
          user?.stripeCustomerId
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function handlePortal() {
    try {
      await createBillingPortal(user?.stripeCustomerId);
    } catch (error) {
      console.error(error);
    }
  }

  const renderPrice = (plan) => {
    return billingCycle === "monthly"
      ? `$${plan.monthly_price}/mo`
      : plan.yearly_price
      ? `$${plan.yearly_price}/yr`
      : "No Yearly Plan";
  };

  return (
    <CustomLayout>
      {!user.isActiveUser && (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Start Now 🚀</h1>
            <div className="flex items-center space-x-2">
              <span>Monthly</span>
              <Switch
                checked={billingCycle === "yearly"}
                onCheckedChange={(checked) =>
                  setBillingCycle(checked ? "yearly" : "monthly")
                }
              />
              <span>Yearly</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-6 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold m-0">{plan.name}</h2>
                  {/* <p className=" text-[10px] m-0 bg-black rounded-md py-1 px-2 text-white inline-block">
                    7 DAYS FREE TRIAL
                  </p> */}
                </div>
                <p className="text-2xl font-bold">{renderPrice(plan)}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={renderPrice(plan) === "No Yearly Plan"}
                  className="mt-6 bg-[#f23250] text-white py-2 px-4 rounded hover:bg-[#f2324fab] disabled:bg-gray-400"
                  onClick={() => handleStripePlan(plan)}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {user.isActiveUser && (
        <>
          <Profile />
          <div className=" justify-between items-start flex flex-col mx-auto">
            <h1 className="text-2xl font-bold">Billing</h1>
          </div>
          <div className=" justify-between items-start flex flex-col mx-auto">
            <Button
              className="bg-black text-white mt-6"
              onClick={() => handlePortal()}
            >
              <FiExternalLink /> Manage Billing
            </Button>
          </div>
        </>
      )}
    </CustomLayout>
  );
};

export default Billing;

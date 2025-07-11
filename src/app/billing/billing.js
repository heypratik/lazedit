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
    {
      id: 1,
      name: "Individual",
      monthly_plan_id: "price_1RjMLLC3lVSKOiCb8vqRm7dd",
      yearly_plan_id: "price_1RjMMwC3lVSKOiCbgwgWV09h",
      monthly_price: 16,
      yearly_price: 13,
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
      id: 2,
      name: "Teams",
      monthly_plan_id: "price_1RjMLyC3lVSKOiCbd7qrMrxt",
      yearly_plan_id: "price_1RjMNCC3lVSKOiCbt2CogAJt",
      monthly_price: 60,
      yearly_price: 54,
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
      ? `$${plan.yearly_price}/mo`
      : "No Yearly Plan";
  };

  return (
    <CustomLayout>
      {!user.isActiveUser && (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Start Now 🚀</h1>
            <div className="flex items-center space-x-2  text-white">
              <span>Monthly</span>
              <Switch
                className="bg-gray-700"
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
                className="border rounded-lg p-6 flex flex-col justify-between glass-strong"
              >
                <div className="flex items-center gap-2 mb-2  text-white">
                  <h2 className="text-xl font-semibold m-0">{plan.name}</h2>
                  {billingCycle === "yearly" && (
                    <p className=" text-[10px] m-0 bg-orange-500 rounded-md py-1 px-2 text-white inline-block">
                      20% OFF
                    </p>
                  )}
                </div>
                <p className="text-2xl font-bold  text-white mb-0 pb-0">
                  {renderPrice(plan)}
                </p>
                <span className="text-white/70 text-sm mt-0">
                  Billed {billingCycle}
                </span>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm  text-white">
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleStripePlan(plan)}
                  disabled={renderPrice(plan) === "No Yearly Plan"}
                  className="relative text-sm md:text-base px-4 md:px-4 py-2 md:py-2 font-medium border-orange-500 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 overflow-hidden w-full sm:w-auto max-w-xs sm:max-w-none"
                >
                  {/* Noise texture overlay */}
                  <div
                    className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
                    style={{
                      backgroundImage: "url(/noise.webp)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  {/* Button text */}
                  <span className="relative z-10 text-white font-semibold text-sm md:text-sm flex items-center justify-center gap-2">
                    Select Plan
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {user.isActiveUser && (
        <>
          <Profile session={session} user={user} />
          <div className=" justify-between items-start flex flex-col mx-auto">
            <h1 className="text-2xl font-bold text-white/70">Billing</h1>
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

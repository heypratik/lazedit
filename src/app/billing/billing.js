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
      name: "Engage",
      monthly_plan_id: "price_1QL6CpGvRrdKx7JCWzZM6uwX",
      yearly_plan_id: "price_1QL6DgGvRrdKx7JCD3HUsCyG",
      monthly_price: 449,
      yearly_price: 3500,
      features: [
        "8 Emails/Month: Strategically designed for maximum impact.",
        "Bi-Weekly Creative Testing: Test and refine creative ideas to boost performance.",
        "Custom Segments: Build targeted email segments for personalized engagement.",
        "Growth Marketing Reporting: Insights to track and improve your email ROI.",
      ],
      trial: 7,
    },
    {
      id: 3,
      name: "Growth",
      monthly_plan_id: "price_1QL6E2GvRrdKx7JCF7R5yFhK",
      yearly_plan_id: "price_1QL6EbGvRrdKx7JCIE12eHBo",
      monthly_price: 689,
      yearly_price: 5500,
      features: [
        "12 Emails/Month: Expand your reach with more campaigns.",
        "3 Batches of Creative Testing: Optimize visuals and messaging monthly.",
        "Targeted Segments: Drive engagement with tailored email audiences.",
        "Detailed Growth Reports: Comprehensive performance metrics to guide decisions.",
      ],
      trial: 7,
    },
    {
      id: 4,
      name: "Scale",
      monthly_plan_id: "price_1QL6F5GvRrdKx7JCm5Z3JUvL",
      yearly_plan_id: "",
      monthly_price: 1399,
      yearly_price: null,
      features: [
        "Unlimited Emails: Scale your campaigns with no limits.",
        "Weekly Creative Testing: Constant optimization for peak performance.",
        "Advanced Segmentation: Precision targeting for every email campaign.",
        "Comprehensive Reporting: Deep insights to drive sustained growth.",
      ],
      trial: 7,
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

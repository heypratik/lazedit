"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import moment from "moment";
import CustomLayout from "../layout/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { RiLoader4Fill } from "react-icons/ri";
import ProductModal from "@/components/productModal/page";

const BigCalendar = dynamic(() => import("@/components/calendar/page"), {
  ssr: false,
});

export default function Calendar({ session, store, eventss, user, plan }) {
  const router = useRouter();
  const [events, setEvents] = useState(eventss ? eventss : []);
  const [viewerDate, setViewerDate] = useState(new Date());
  const [theEvent, setTheEvent] = useState();
  const [startCampaign, setStartCampaign] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [smsPopup, setSmsPopup] = useState(false);
  const [productPopup, setProductPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regenerateLoading, setRegenerateLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [smsStep, setSmsStep] = useState(1);
  const [variants, setVariants] = useState([]);
  const [error, setError] = useState(null);

  const handleProductSelect = (products) => {
    setSelectedProducts(products);
    setProductPopup(false);
  };

  const generateSMSContent = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make sure we have the required data
      if (
        !startCampaign ||
        !selectedProducts ||
        selectedProducts.length === 0
      ) {
        throw new Error("Missing campaign or product data");
      }

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI}`,
          },
          body: JSON.stringify({
            model: "gpt-4-turbo-preview",
            messages: [
              {
                role: "system",
                content:
                  "You are a marketing expert specialized in creating engaging SMS promotional content. Generate three unique variants that are compelling and conversion-focused. Each variant should be distinct but maintain the core message and promotion details. Include relevant emojis and keep each message under 160 characters.",
              },
              {
                role: "user",
                content: `Create 3 SMS promotional variants for the following campaign:
                Campaign Type: ${startCampaign["Campaign Type"]}
                Date: ${startCampaign.Date}
                Description: ${startCampaign.Description}
                Strategy: ${startCampaign["Strategy Title"]}
                Product: ${selectedProducts[0]?.title || "No product selected"}
                Price: ${
                  selectedProducts[0]?.priceRangeV2?.minVariantPrice?.amount ||
                  "N/A"
                } ${
                  selectedProducts[0]?.priceRangeV2?.minVariantPrice
                    ?.currencyCode || ""
                }
                URL: ${selectedProducts[0]?.onlineStoreUrl || "N/A"}
                
                Format each variant as:
                Variant A: "[message]"
                Variant B: "[message]"
                Variant C: "[message]"
                
                Include emojis, keep under 160 chars, and focus on conversion.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      const parsedVariants = content
        .split("\n")
        .filter((line) => line.startsWith("Variant"))
        .map((variant) => {
          const [label, message] = variant.split(": ");
          return {
            label,
            message: message.replace(/['"]/g, "").trim(),
          };
        });

      setVariants(parsedVariants);
      setSmsStep(3); // Move to results step
    } catch (err) {
      setError(err.message);
      console.error("Error generating SMS content:", err);
    } finally {
      setLoading(false);
    }
  };

  const onClickGenerateSchedule = () => {
    async function regenerate() {
      setRegenerateLoading(true);
      const storeID = user.shopifyStoreId || store.id;

      try {
        const response = await fetch(
          `https://dev.mybranzapi.link/v1/calender_generator`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              country: "Canada",
              year: `${new Date().getFullYear()} ${new Date().toLocaleString(
                "default",
                { month: "long" }
              )}`,
              planType: `${plan.planName} ${plan.emails}`,
              storeId: String(storeID),
            }),
          }
        );
        const data = await response.json();
        const calData = Object.values(data)[0];
        setEvents(calData);
      } catch (error) {
        console.error("Error regenerating schedule:", error);
      } finally {
        setRegenerateLoading(false);
      }
    }
    regenerate();
  };

  const onSelectCalendarEvent = (e) => {
    const findEvent = events.find(
      (event) => event["Strategy Title"] === e.title
    );
    setStartCampaign(findEvent);
    setOpenPopup(true);
  };

  const editedCampaignArray = events?.map((campaign) => {
    const start = moment(campaign.Date).toDate();
    const end = moment(campaign.Date).add(1, "days").toDate();
    const title = campaign["Strategy Title"];
    return { start, end, title };
  });

  console.log(selectedProducts);

  return (
    <CustomLayout>
      {/* Initial Campaign Dialog */}
      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{startCampaign?.["Strategy Title"]}</DialogTitle>
            <DialogDescription>
              <p className="text-base text-left">
                <span className="font-bold">Subject: </span>
                {startCampaign?.["Example Content"]}
              </p>
              <p className="text-base text-left">
                <span className="font-bold">Campaign Type: </span>
                {startCampaign?.["Campaign Type"]}
              </p>
              <p className="text-base text-left mb-0">
                <span className="font-bold">Description: </span>
                {startCampaign?.["Description"]}
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setSmsPopup(true);
                setOpenPopup(false);
              }}
              className="bg-black text-white"
            >
              Generate SMS Campaign
            </Button>
          </DialogFooter>
          <p className="text-xs mt-2 mb-0 text-center">
            This data can be changed while editing in the next step.
          </p>
        </DialogContent>
      </Dialog>

      {/* SMS Campaign Dialog */}
      <Dialog open={smsPopup} onOpenChange={setSmsPopup}>
        <DialogContent className="w-[80vw] max-w-[1200px] h-[70vh] max-h-[700px]">
          <DialogHeader>
            <DialogTitle>Generate SMS Campaign</DialogTitle>
            {smsStep === 1 && (
              <DialogDescription>
                <label className="text-base text-left w-full text-black font-bold mt-4">
                  Subject
                  <input
                    type="text"
                    name="Subject"
                    className="w-full border border-gray-300 text-black font-normal rounded p-2 mt-2"
                    value={startCampaign?.["Example Content"] || ""}
                    onChange={(e) =>
                      setStartCampaign({
                        ...startCampaign,
                        "Example Content": e.target.value,
                      })
                    }
                  />
                </label>
                <label className="text-base text-left w-full text-black font-bold mt-4">
                  Campaign Type
                  <input
                    type="text"
                    name="Campaign Type"
                    className="w-full border border-gray-300 text-black font-normal rounded p-2 mt-2"
                    value={startCampaign?.["Campaign Type"] || ""}
                    onChange={(e) =>
                      setStartCampaign({
                        ...startCampaign,
                        "Campaign Type": e.target.value,
                      })
                    }
                  />
                </label>
                <label className="text-base text-left w-full text-black font-bold mt-4">
                  Description
                  <textarea
                    name="Description"
                    className="w-full border border-gray-300 text-black font-normal rounded p-2 mt-2"
                    value={startCampaign?.Description || ""}
                    onChange={(e) =>
                      setStartCampaign({
                        ...startCampaign,
                        Description: e.target.value,
                      })
                    }
                  />
                </label>
              </DialogDescription>
            )}

            {smsStep === 2 && (
              <ProductModal
                handleProductSelect={handleProductSelect}
                closeDialog={() => setProductPopup(false)}
                selectedProducts={selectedProducts}
                shopifyStoreId={user.shopifyStoreId}
                storeId={store.id}
                userType={user.shopifyStoreId ? "shopify" : "database"}
                immediateSelection={true}
              />
            )}

            {smsStep === 3 && (
              <DialogDescription>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <RiLoader4Fill className="animate-spin text-3xl" />
                  </div>
                ) : error ? (
                  <div className="text-red-500 p-4">{error}</div>
                ) : (
                  <div className="space-y-4 mt-4">
                    {variants.map((variant, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h3 className="font-bold mb-2 text-black">
                          {variant.label}
                        </h3>
                        <p className="text-black">
                          {variant.message}{" "}
                          <span>[{selectedProducts[0].onlineStoreUrl}]</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </DialogDescription>
            )}
          </DialogHeader>

          <DialogFooter>
            {smsStep === 3 ? (
              <>
                <Button
                  onClick={() => {
                    setSmsStep(1);
                    setSelectedProducts([]);
                  }}
                  className="bg-gray-200 text-black mr-2 hover:bg-gray-200"
                >
                  Start Over
                </Button>
                <Button
                  onClick={() => setSmsPopup(false)}
                  className="bg-black text-white"
                >
                  Close
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  if (smsStep === 1) {
                    setSmsStep(2);
                  } else if (smsStep === 2) {
                    generateSMSContent();
                  }
                }}
                className="bg-black text-white flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RiLoader4Fill className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            )}
          </DialogFooter>

          {smsStep !== 3 && (
            <p className="text-xs mt-2 mb-0 text-center">
              This data can be changed while editing in the next step.
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Calendar View */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-11 p-5">
            {!user.shopifyStoreId && (
              <div className="pb-4 flex flex-row items-center justify-center sm:justify-between flex-wrap gap-4">
                <button
                  onClick={onClickGenerateSchedule}
                  className="flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded hover:bg-[#f2324fab]"
                >
                  Regenerate schedule for month
                  <RiLoader4Fill
                    className={`text-white ${
                      regenerateLoading ? "animate-spin" : "hidden"
                    }`}
                  />
                </button>
              </div>
            )}
            <BigCalendar
              events={editedCampaignArray}
              viewerDate={viewerDate}
              onSelectCalendarEvent={onSelectCalendarEvent}
              setViewerDate={setViewerDate}
            />
          </div>
        </div>
      </div>
    </CustomLayout>
  );
}

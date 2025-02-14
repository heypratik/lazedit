"use client";

import { useEffect, useState, useMemo } from "react";
import CustomLayout from "../layout/layout";
import toast, { Toaster } from "react-hot-toast";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { BsCurrencyDollar } from "react-icons/bs";
import Link from "next/link";
import { fetchCampaignMetrics } from "../utlis/klaviyo";
import crypto from "crypto-js";
import { Skeleton } from "@/components/ui/skeleton";
import { MdAdsClick } from "react-icons/md";
import { RiSpam2Line, RiLoader4Fill } from "react-icons/ri";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { BiSolidMessageSquareEdit } from "react-icons/bi";

import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

function encryptApiKey(apiKey) {
  const nonce = Date.now().toString();
  const apiKeyWithNonce = `${nonce}:${apiKey}`;
  const encrypted = crypto.AES.encrypt(
    apiKeyWithNonce,
    process.env.NEXT_PUBLIC_SECRET
  ).toString();
  return { encrypted, nonce };
}

const metricsCache = new Map();

export default function Dashboard({
  session,
  servermetrics,
  serverCampaigns,
  store,
}) {
  const router = useRouter();
  const { encrypted, nonce } = encryptApiKey(store?.klaviyoKey);

  const [metrics, setMetrics] = useState(servermetrics ? servermetrics : null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [prevSelectedMetric, setPrevSelectedMetric] = useState(null);

  const [campaigns, setCampaigns] = useState(
    serverCampaigns ? serverCampaigns : null
  );

  console.log(campaigns);
  const [allCampaignsMetrics, setAllCampaignsMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use UseEffect to find "Placed Order" from metrics and set it as selected metric
  useEffect(() => {
    if (metrics) {
      const placedOrderMetric = metrics.find(
        (metric) => metric?.attributes?.name === "Placed Order"
      );
      setSelectedMetric(placedOrderMetric?.id);
    }
  }, [metrics]);

  function handleMetricsChange(e) {
    if (selectedMetric) {
      setPrevSelectedMetric(selectedMetric);
    }
    setSelectedMetric(e.target.value);
  }

  useEffect(() => {
    // Function to fetch metrics
    async function getMetrics() {
      setLoading(true);
      const cacheKey = `${selectedMetric}`;

      // Check if the metrics for this request are already cached
      if (metricsCache.has(cacheKey) && metricsCache.get(cacheKey) !== null) {
        notification(true, "Data Loaded");
        setLoading(false);
        return setAllCampaignsMetrics(metricsCache.get(cacheKey));
      }

      try {
        metricsCache.set(cacheKey, null);
        const response = await fetch("/api/klaviyo/get-dashboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${encrypted}`,
            Xauth: `${nonce}`,
          },
          body: JSON.stringify({
            campaigns: campaigns,
            selectedMetrics: selectedMetric,
            timeFrame: "last_30_days",
          }),
        });

        if (!response.ok) {
          notification(false, "Failed to fetch metrics");
          setSelectedMetric(prevSelectedMetric);
          setLoading(false);
          return;
        }

        const data = await response.json();
        metricsCache.set(cacheKey, data);
        notification(true, "Data Loaded");
        setLoading(false);
        setAllCampaignsMetrics(data);
      } catch (error) {
        setLoading(false);
        notification(false, "An error occurred while fetching metrics");
        setSelectedMetric(prevSelectedMetric);
      }
    }

    // Only fetch metrics if both campaigns and selectedMetric are available
    if (selectedMetric && campaigns) {
      getMetrics();
    }
  }, [selectedMetric]);

  function getMetricValue(campaignId) {
    const metric = allCampaignsMetrics?.attributes?.results?.find(
      (metric) => metric?.groupings?.campaign_id === campaignId
    );
    return {
      average_order_value: metric?.statistics?.average_order_value,
      bounce_rate: metric?.statistics?.bounce_rate,
      bounced_or_failed: metric?.statistics?.bounced_or_failed,
      bounced_or_failed_rate: metric?.statistics?.bounced_or_failed_rate,
      click_rate: metric?.statistics?.click_rate,
      click_to_open_rate: metric?.statistics?.click_to_open_rate,
      clicks: metric?.statistics?.clicks,
      clicks_unique: metric?.statistics?.clicks_unique,
      conversion_rate: metric?.statistics?.conversion_rate,
      conversion_uniques: metric?.statistics?.conversion_uniques,
      conversion_value: metric?.statistics?.conversion_value,
      conversions: metric?.statistics?.conversions,
      delivered: metric?.statistics?.delivered,
      delivery_rate: metric?.statistics?.delivery_rate,
      failed: metric?.statistics?.failed,
      failed_rate: metric?.statistics?.failed_rate,
      open_rate: metric?.statistics?.open_rate,
      opens: metric?.statistics?.opens,
      opens_unique: metric?.statistics?.opens_unique,
      recipients: metric?.statistics?.recipients,
      revenue_per_recipient: metric?.statistics?.revenue_per_recipient,
      spam_complaint_rate: metric?.statistics?.spam_complaint_rate,
      spam_complaints: metric?.statistics?.spam_complaints,
      unsubscribe_rate: metric?.statistics?.unsubscribe_rate,
      unsubscribe_uniques: metric?.statistics?.unsubscribe_uniques,
      unsubscribes: metric?.statistics,
    };
  }

  const [timeFrame, setTimeFrame] = useState("last7days");
  const [data, setData] = useState();

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      console.log(result);
      setData(result);
    }
    fetchData();
  }, [timeFrame]);

  async function getData() {
    try {
      const dashboardResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/dashboard/${sellerData?.data?.Brands?.[0]?.id}/${timeFrame}`
      );
      const dashboardData = await dashboardResponse.json();
      return dashboardData;
    } catch (error) {
      return {
        success: false,
        totalRevenue: null,
        salesCount: 0,
        barChartData: [],
        recentSales: [],
      };
    }
  }

  function notification(success, message) {
    if (success) {
      toast.success(message);
    } else {
      toast.error(message || "An error occurred");
    }
  }

  const aggregateMetrics = useMemo(() => {
    if (!allCampaignsMetrics) return null;

    let totalOrderValue = 0;
    let clickToOpenRate = 0;
    let unsubscribes = 0;

    function calculateClicks(clicks) {
      if (clicks == 0 || clicks == NaN || clicks == undefined || clicks == null)
        return 0;
      return (clicks * 100) / allCampaignsMetrics.attributes.results.length;
    }

    allCampaignsMetrics.attributes.results.forEach((metric) => {
      const stats = metric?.statistics;
      totalOrderValue += stats?.conversion_value;
      clickToOpenRate += stats?.click_rate;
      unsubscribes += stats?.unsubscribes;
    });

    const averageOrderValue = totalOrderValue;
    const clickRate = calculateClicks(clickToOpenRate);

    return {
      averageOrderValue,
      clickRate,
      unsubscribes,
    };
  }, [allCampaignsMetrics]);

  return (
    <CustomLayout>
      <>
        <Toaster position="top-center" reverseOrder={true} />
        <div>
          <div className="py-0">
            <div className="">
              <div>
                <div className="flex items-center justify-between py-4">
                  <div className="flex flex-1 justify-start items-center">
                    <h1 className=" text-[#000] text-2xl mr-8 font-semibold">
                      Dashboard
                    </h1>
                  </div>
                  {!selectedMetric && (
                    <p className="mb-0 text-xs font-semibold text-red-500 mr-2 underline">
                      Please select a metric first:{" "}
                    </p>
                  )}
                  <RiLoader4Fill
                    className={`text-[#000] ${
                      loading ? "animate-spin" : "hidden"
                    } mr-2`}
                  />
                  <select
                    onChange={(e) => handleMetricsChange(e)}
                    className={`mr-5 text-sm text-gray-800 font-medium rounded py-1 px-3 border border-gray-400 p-4 ${
                      !selectedMetric ? "!border-red-500" : ""
                    }`}
                  >
                    <option value="" disabled selected>
                      Select Conversion Metric
                    </option>
                    {metrics &&
                      metrics.length > 0 &&
                      metrics.map((metric, index) => {
                        return (
                          <option
                            key={index}
                            value={metric?.id}
                            selected={selectedMetric === metric?.id}
                          >
                            {metric?.attributes?.name}
                          </option>
                        );
                      })}
                  </select>
                  <select
                    onChange={(e) => setTimeFrame(e.target.value)}
                    className="mr-5 text-sm text-gray-800 font-medium rounded py-1 px-3 border border-gray-400 p-4"
                  >
                    <option
                      selected={timeFrame === "last30days"}
                      value="last30days"
                    >
                      Last 30 Days
                    </option>
                  </select>
                </div>

                <div className="flex justify-start">
                  <div className="flex-[1] mr-4 p-6 rounded-lg bg-[#bef2642c] border !border-[#587a1c]">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm text-[#587a1c]">
                        Total Order Value
                      </p>
                      <BsCurrencyDollar />
                    </div>
                    <span className="font-bold text-3xl mt-2 text-[#587a1c]">
                      {aggregateMetrics ? (
                        `$${aggregateMetrics.averageOrderValue.toFixed(2)}`
                      ) : (
                        <Skeleton className="w-[60px] h-[20px]" />
                      )}
                    </span>
                  </div>
                  <div className="flex-[1] mr-4 p-6 rounded-lg border !border-gray-400">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm text-gray-700">
                        Average Click Rate
                      </p>
                      <MdAdsClick />
                    </div>
                    <span className="font-bold text-3xl mt-2">
                      {aggregateMetrics ? (
                        `${aggregateMetrics.clickRate.toFixed(2)}%`
                      ) : (
                        <Skeleton className="w-[60px] h-[20px]" />
                      )}
                    </span>
                  </div>
                  <div className="flex-[1] mr-4 p-6 rounded-lg bg-[#f264642f] border !border-[#7a1c1c]">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm text-[#7a1c1c]">
                        Total Unsubscribes
                      </p>
                      <RiSpam2Line />
                    </div>
                    <span className="font-bold text-3xl mt-2 text-[#7a1c1c]">
                      {aggregateMetrics ? (
                        `${aggregateMetrics.unsubscribes}`
                      ) : (
                        <Skeleton className="w-[60px] h-[20px]" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex mt-5">
                  <div className="flex-[1] mr-4 rounded-lg shadow-[rgba(6,_24,_44,_0.2)_0px_0px_3px_0.2px] relative min-h-[390px]">
                    {/* Recreate the above in a table */}
                    {campaigns && campaigns.length > 0 && (
                      <Table>
                        <TableHeader className="bg-slate-900">
                          <TableColumn className="font-semibold text-md text-gray-700 py-4">
                            Campaign Name
                          </TableColumn>
                          <TableColumn className="font-semibold text-md text-gray-700">
                            Status
                          </TableColumn>
                          <TableColumn className="font-semibold text-md text-gray-700">
                            Open Rate
                          </TableColumn>
                          <TableColumn className="font-semibold text-md text-gray-700">
                            Click Rate
                          </TableColumn>
                          <TableColumn className="font-semibold text-md text-gray-700">
                            Placed Order
                          </TableColumn>
                        </TableHeader>
                        <TableBody>
                          {campaigns.map((campaign, index) => {
                            const metrics = allCampaignsMetrics
                              ? getMetricValue(campaign.id)
                              : null;
                            return (
                              <TableRow
                                key={index}
                                className={`${
                                  index % 2
                                    ? "bg-slate-50 hover:bg-slate-100 rounded"
                                    : "bg-white hover:!bg-slate-100 rounded"
                                }`}
                              >
                                <TableCell className="font-semibold text-sm text-gray-700 py-4">
                                  <div className="flex items-center justify-start gap-2">
                                    {campaign?.attributes?.name}
                                    {new Date(
                                      campaign?.attributes?.updated_at
                                    ) >=
                                      new Date(
                                        "2025-01-10T03:17:18.135101+00:00"
                                      ) && (
                                      <p
                                        className="text-[12px] z-50 underline m-0 cursor-pointer"
                                        onClick={() =>
                                          router.push(
                                            `email-editor?clone=${campaign.id}`
                                          )
                                        }
                                      >
                                        Click to Clone
                                      </p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-semibold text-xs text-gray-500 py-4">
                                  {campaign?.attributes?.status == "Draft" ? (
                                    <span className="bg-[#eaedef] rounded-full px-3 py-2 flex items-center justify-center gap-2 max-w-fit text-[#5d5e60]">
                                      <BiSolidMessageSquareEdit
                                        color="#5d5e60"
                                        size="16px"
                                      />{" "}
                                      Draft
                                    </span>
                                  ) : campaign?.attributes?.status == "Sent" ? (
                                    <span className="bg-[#ebfad3] rounded-full px-3 py-2 flex items-center justify-center gap-2 max-w-fit text-[#4f8a2d]">
                                      <FaCheckCircle
                                        color="#4f8a2d"
                                        size="16px"
                                      />{" "}
                                      Sent
                                    </span>
                                  ) : (
                                    campaign?.attributes?.status
                                  )}
                                </TableCell>
                                <TableCell className="font-semibold text-xs text-gray-500 py-4">
                                  {metrics?.open_rate !== undefined ? (
                                    `${(metrics.open_rate * 100).toFixed(2)}%`
                                  ) : allCampaignsMetrics ? (
                                    "--"
                                  ) : (
                                    <Skeleton className="w-[60px] h-[20px]" />
                                  )}
                                </TableCell>
                                <TableCell className="font-semibold text-xs text-gray-500 py-4">
                                  {metrics?.click_rate !== undefined ? (
                                    `${(metrics.click_rate * 100).toFixed(2)}%`
                                  ) : allCampaignsMetrics ? (
                                    "--"
                                  ) : (
                                    <Skeleton className="w-[60px] h-[20px]" />
                                  )}
                                </TableCell>
                                <TableCell className="font-semibold text-xs text-gray-500 py-4">
                                  {metrics?.conversion_rate !== undefined ? (
                                    `${metrics.conversions}`
                                  ) : allCampaignsMetrics ? (
                                    "--"
                                  ) : (
                                    <Skeleton className="w-[60px] h-[20px]" />
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </CustomLayout>
  );
}

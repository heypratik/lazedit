"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { LineChart, Line } from "recharts";
import CustomLayout from "../layout/layout";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import Map from "./Map";

const Insights = ({ session, store, insights, metrics }) => {
  const [ageDistribution, setAgeDistribution] = useState(null);
  const [genderDistribution, setGenderDistribution] = useState(null);
  const [locationDistribution, setLocationDistribution] = useState(null);
  const [topProducts, setTopProducts] = useState(null);
  const [campiagnMetrics, setCampaignMetrics] = useState(null);

  const aggregateMetrics = useMemo(() => {
    console.log(metrics);
    if (!metrics) return null;

    let totalOrderValue = 0;
    let clickToOpenRate = 0;
    let unsubscribes = 0;

    function calculateClicks(clicks) {
      if (clicks == 0 || clicks == NaN || clicks == undefined || clicks == null)
        return 0;
      return (clicks * 100) / metrics.attributes?.results?.length;
    }

    metrics.attributes.results.forEach((metric) => {
      const stats = metric?.statistics;
      totalOrderValue += stats?.conversion_value;
      clickToOpenRate += stats?.click_rate;
      unsubscribes += stats?.unsubscribes;
    });

    const averageOrderValue =
      totalOrderValue / metrics?.attributes?.results?.length;
    const clickRate = calculateClicks(clickToOpenRate);

    return {
      averageOrderValue,
      clickRate,
      unsubscribes,
    };
  }, [metrics]);

  useEffect(() => {
    if (insights) {
      setAgeDistribution(() => {
        const arr = [];
        for (let [key, value] of Object.entries(
          insights?.age_category_distribution?.Percentage
        )) {
          const newObj = { ageGroup: key, customers: value };
          arr.push(newObj);
        }
        return arr;
      });

      setGenderDistribution(() => {
        const arr = [];
        for (let [key, value] of Object.entries(
          insights?.gender_distribution?.Percentage
        )) {
          const newObj = { name: key, value: value };
          arr.push(newObj);
        }
        return arr;
      });

      setLocationDistribution(() => {
        const arr = [];
        for (let [key, value] of Object.entries(
          insights?.location_distribution?.country?.Percentage
        )) {
          const newObj = { country: key, value: value };
          arr.push(newObj);
        }
        return arr;
      });
    }
  }, [insights]);

  // Original data
  const genderData = [
    { name: "Male", value: 65 },
    { name: "Female", value: 35 },
  ];

  const ageData = [
    { ageGroup: "18-30", customers: 200 },
    { ageGroup: "30-50", customers: 150 },
    { ageGroup: "50+", customers: 80 },
  ];

  const funnelData = [
    { stage: "Site Visitors", count: 10000 },
    { stage: "Add to Cart", count: 5000 },
    { stage: "Started Checkout", count: 3000 },
    { stage: "Completed Purchase", count: 2000 },
    { stage: "Repeat Customers", count: 800 },
  ];

  const engagementData = [
    { month: "Jan", openRate: 45, clickRate: 22, conversion: 12 },
    { month: "Feb", openRate: 52, clickRate: 28, conversion: 15 },
    { month: "Mar", openRate: 48, clickRate: 25, conversion: 14 },
    { month: "Apr", openRate: 55, clickRate: 30, conversion: 18 },
    { month: "May", openRate: 58, clickRate: 32, conversion: 20 },
    { month: "Jun", openRate: 54, clickRate: 29, conversion: 17 },
  ];

  const productData = [
    { product: "Smartphones", count: 1200, percentage: 25 },
    { product: "Laptops", count: 950, percentage: 20 },
    { product: "Headphones", count: 850, percentage: 18 },
    { product: "Tablets", count: 600, percentage: 12 },
    { product: "Smartwatches", count: 400, percentage: 8 },
  ];

  const heatmapData = [
    { region: "New York", q1: 82, q2: 74, q3: 89, q4: 95 },
    { region: "Los Angeles", q1: 68, q2: 87, q3: 92, q4: 78 },
    { region: "Chicago", q1: 75, q2: 82, q3: 76, q4: 85 },
  ];

  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const COLORS = ["#f23250", "#f25069", "#f0677c", "#fcb8c3"];
  const COLORS2 = ["#f23250", "#cf6375"];

  const getHeatmapColor = (value) => {
    const minValue = 65;
    const maxValue = 95;
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    return `rgba(242, 50, 81, ${0.2 + normalizedValue * 0.8})`; // Brand color
  };

  return (
    <CustomLayout>
      <div className="p-6 max-w-full mx-auto space-y-6 bg-white text-black">
        <h1 className="text-3xl font-bold mb-8">Customer Insights</h1>

        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Purchase Funnel & Engagement */}
          <div className="flex-1 bg-gray-100 p-4 rounded-md">
            <h2 className="font-bold text-xl mb-4">Purchase Funnel</h2>
            <BarChart
              width={550}
              height={300}
              data={funnelData}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={150} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#8884d8"
                label={{ position: "right", fill: "#666" }}
              >
                {funnelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </div>

          {metrics && (
            <div className="flex-1 bg-gray-100 p-4 rounded-md">
              <h2 className="font-bold text-xl">
                Campaign Engagement Metrics (Last 12 Months){" "}
              </h2>
              {/* <LineChart width={550} height={300} data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="openRate"
              stroke="#8884d8"
              name="Open Rate %"
            />
            <Line
              type="monotone"
              dataKey="clickRate"
              stroke="#82ca9d"
              name="Click Rate %"
            />
            <Line
              type="monotone"
              dataKey="conversion"
              stroke="#ffc658"
              name="Conversion %"
            />
          </LineChart> */}
              <div className="flex flex-wrap items-center gap-3 h-[90%]">
                <div className="w-full p-2 flex items-center justify-center bg-white text-black font-bold rounded-lg">
                  <span className="p-2 flex flex-col items-center justify-center">
                    <p className=" mb-0 text-3xl">
                      ${aggregateMetrics?.averageOrderValue.toFixed(2)}
                    </p>{" "}
                    <p className="text-[#f23250] mb-0 ">Avg Order Value</p>
                  </span>
                </div>
                <div className="w-full p-2 flex items-center justify-center bg-white text-black font-bold rounded-lg">
                  <span className="p-2 flex flex-col items-center justify-center">
                    <p className=" mb-0  text-3xl">
                      {aggregateMetrics?.clickRate.toFixed(2)}%
                    </p>{" "}
                    <p className="text-[#f23250] mb-0 ">Click Rate</p>
                  </span>
                </div>
                <div className="w-full p-2 flex items-center justify-center bg-white text-black font-bold rounded-lg">
                  <span className="p-2 flex flex-col items-center justify-center">
                    <p className=" text-3xl mb-0 ">
                      {aggregateMetrics?.unsubscribes}
                    </p>{" "}
                    <p className="text-[#f23250] mb-0 ">Total Unsubscribes</p>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Top Products, Gender Distribution & Age Distribution */}
          {topProducts && (
            <div className="flex-1 bg-gray-100 p-4 rounded-md">
              <h2 className="font-bold text-xl mb-4">Top Products</h2>
              <div className="space-y-4">
                {productData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.product}</span>
                      <span className="bg-gray-200 text-black py-1 px-2 rounded">
                        {item?.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#f23250] h-2.5 rounded-full"
                        style={{ width: `${item?.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights && (
            <div className="flex-1 bg-gray-100 p-4 rounded-md flex items-center justify-center flex-col">
              <h2 className="font-bold text-xl mb-4 w-full text-left">
                Gender Distribution (%)
              </h2>
              <PieChart width={400} height={300}>
                <Pie
                  data={genderDistribution}
                  cx={200}
                  cy={150}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS2[index % COLORS2.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </div>
          )}

          {ageDistribution && (
            <div className="flex-1 bg-gray-100 p-4 rounded-md flex items-center justify-center flex-col">
              <h2 className="font-bold text-xl mb-4 text-left w-full">
                Age Distribution (%)
              </h2>
              <BarChart width={400} height={300} data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="#f33753" />
              </BarChart>
            </div>
          )}
        </div>

        {/* <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="font-bold text-xl mb-4">Customer Satisfaction Score by Region and Quarter (%)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border">Region</th>
                {quarters.map((quarter) => (
                  <th key={quarter} className="p-2 border">{quarter}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, i) => (
                <tr key={row.region}>
                  <td className="p-2 border font-medium">{row.region}</td>
                  {quarters.map((quarter, j) => {
                    const value = row[quarter.toLowerCase()];
                    return (
                      <td
                        key={`${i}-${j}`}
                        className="p-4 border text-center"
                        style={{
                          backgroundColor: getHeatmapColor(value),
                          color: value > 80 ? 'white' : 'black'
                        }}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
        {locationDistribution && <Map data={locationDistribution} />}
      </div>
    </CustomLayout>
  );
};

export default Insights;

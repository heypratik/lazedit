"use server";

import React from "react";
import Insights from "./insights";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust path as needed
import { createDecipheriv } from "crypto";
import crypto from "crypto-js";

async function getStore(userId) {
  if (!userId) {
    return null;
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/settings/get`,
    {
      method: "POST",
      body: JSON.stringify({ userId }),
    }
  );
  const data = await response.json();
  return data.store;
}

async function getInsights(user) {
  if (!user) {
    return null;
  }

  if (user.shopifyStoreId) {
    const decipher = createDecipheriv(
      "aes-256-cbc",
      "2b7fac7fd69c14428852bc6ee54530a0",
      Buffer.alloc(16)
    );
    let decrypted = decipher.update(user.shopifyStoreId, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    const shopInfo = JSON.parse(decrypted);

    const response = await fetch(
      `http://dev.mybranzapi.link/v1/store_analysis?store_id=${shopInfo?.id}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to fetch insights");
      return null;
    }

    return data;
  }

  return null;
}

async function getMetrics(key) {
  try {
    const res = await fetch(`https://a.klaviyo.com/api/metrics/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        revision: "2024-07-15",
        Authorization: `Klaviyo-API-Key ${key}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch data");
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

const metricsCache = new Map();

async function getMetricsNumbers(store, foundName) {
  function encryptApiKey(apiKey) {
    const nonce = Date.now().toString();
    const apiKeyWithNonce = `${nonce}:${apiKey}`;
    const encrypted = crypto.AES.encrypt(
      apiKeyWithNonce,
      process.env.NEXT_PUBLIC_SECRET
    ).toString();
    return { encrypted, nonce };
  }

  const { encrypted, nonce } = encryptApiKey(store?.klaviyoKey);

  const cacheKey = `${"Placed Order"}`;

  if (metricsCache.has(cacheKey) && metricsCache.get(cacheKey) !== null) {
    return metricsCache.get(cacheKey);
  }

  try {
    metricsCache.set(cacheKey, null);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/klaviyo/get-dashboard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${encrypted}`,
          Xauth: `${nonce}`,
        },
        body: JSON.stringify({
          selectedMetrics: foundName.id,
          timeFrame: "last_12_months",
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch data");
      return;
    }

    const data = await response.json();
    metricsCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function Page() {
  const session = await getServerSession(authOptions);
  const store = await getStore(session?.user?.id ? session.user.id : null);
  const insights = await getInsights(session?.user?.id ? session.user : null);
  const metricsName = await getMetrics(store?.klaviyoKey);
  const foundName = metricsName.find(
    (metric) => metric.attributes.name === "Placed Order"
  );
  const metrics = await getMetricsNumbers(store, foundName);

  console.log(insights);
  console.log(metrics);

  return (
    <>
      <Insights
        session={session}
        store={store}
        insights={insights}
        metrics={metrics}
      />
    </>
  );
}

export default Page;

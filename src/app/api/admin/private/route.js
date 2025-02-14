import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import crypto from "crypto-js";
import Store from "../../../../../models/Store";
import Learning from "../../../../../models/Learning";
import { Op } from "sequelize";

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
      throw new Error("Failed to fetch metrics");
    }

    const data = await res.json();
    const arrayofMetrics = data.data;
    const placedOrderMetric = arrayofMetrics.find(
      (metric) => metric.attributes.name === "Placed Order"
    );
    const placedOrderMetricId = placedOrderMetric.id;

    return placedOrderMetricId;
  } catch (error) {
    console.error(error);
  }
}

async function getCampaigns(key) {
  try {
    const response = await fetch(
      `https://a.klaviyo.com/api/campaigns?include=campaign-messages&filter=equals(messages.channel,'email')`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          revision: "2024-10-15",
          Authorization: `Klaviyo-API-Key ${key}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch metrics");
    }

    const data = await response.json();
    return data.included;
  } catch (error) {
    console.error(error);
  }
}

async function fetchCampaignMetrics(key, selectedMetric) {
  try {
    const response = await fetch(
      `https://a.klaviyo.com/api/campaign-values-reports/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          revision: "2024-07-15",
          Authorization: `Klaviyo-API-Key ${key}`,
        },
        body: JSON.stringify({
          data: {
            type: "campaign-values-report",
            attributes: {
              statistics: [
                "average_order_value",
                "bounce_rate",
                "bounced_or_failed",
                "bounced_or_failed_rate",
                "click_rate",
                "click_to_open_rate",
                "clicks",
                "clicks_unique",
                "conversion_rate",
                "conversion_uniques",
                "conversion_value",
                "conversions",
                "delivered",
                "delivery_rate",
                "failed",
                "failed_rate",
                "open_rate",
                "opens",
                "opens_unique",
                "recipients",
                "revenue_per_recipient",
                "spam_complaint_rate",
                "spam_complaints",
                "unsubscribe_rate",
                "unsubscribe_uniques",
                "unsubscribes",
              ],
              timeframe: {
                key: "last_12_months",
              },
              conversion_metric_id: `${selectedMetric}`,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch metrics: ${errorData.detail || response.statusText}`
      );
    }

    const data = await response.json();

    return data.data.attributes.results;
  } catch (error) {
    console.error(
      "An error occurred during the metric fetching process:",
      error
    );
    throw error;
  }
}

export async function POST(req, res) {
  const allUsers = await Store.findAll({
    where: {
      klaviyoKey: {
        [Op.not]: null,
      },
    },
  });

  // Loop through all users
  let payload = [];
  for (let user of allUsers) {
    let metricId = null;
    let campaignData = null;
    let campaignMetrics = null;
    try {
      metricId = await getMetrics(user.klaviyoKey);
      campaignData = await getCampaigns(user.klaviyoKey);
      campaignMetrics = await fetchCampaignMetrics(user.klaviyoKey, metricId);

      for (let campaign of campaignData) {
        let campaignId = campaign.relationships.campaign.data.id;
        let campaignMetricsData = campaignMetrics.find(
          (metric) => metric.groupings.campaign_id === campaignId
        );

        if (campaignMetricsData) {
          payload.push({
            metric: metricId,
            campaignId: campaignId,
            storeId: user.id,
            statistics: campaignMetricsData.statistics,
            campaignData: campaign.attributes,
            channel: campaign.attributes.channel,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  }

  // Remove Any Duplicate Objects from the Payload
  payload = payload.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.metric === value.metric &&
          t.campaignId === value.campaignId &&
          t.storeId === value.storeId
      )
  );

  // Upload All Payload Objects to the Database. If the object already exists, update it.
  for (let data of payload) {
    try {
      await Learning.upsert(data);
    } catch (error) {
      console.error("Error uploading data to the database:", error);
    }
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

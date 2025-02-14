export async function fetchCampaignMetrics(campaigns, key, selectedMetric) {
    const allMetrics = await Promise.all(campaigns.map(async (campaign) => {
      if (campaign?.attributes?.status === 'Sent') {
      const response = await fetch(`https://a.klaviyo.com/api/campaign-values-reports/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'revision': '2024-07-15',
          'Authorization': `Klaviyo-API-Key ${key}`
        },
        body: JSON.stringify({
          "data": {
            "type": "campaign-values-report",
            "attributes": {
              "statistics": [
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
                "unsubscribes"
              ],
              "timeframe": {
                "key": "last_12_months"
              },
              "conversion_metric_id": `${selectedMetric}`,
                   "filter": `equals(campaign_id,'${campaign.id}')`
            }
          }
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await response.json();
      return data.data;
      }
      return null;
    })
    )
  }
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import crypto from 'crypto-js';

export async function POST(req, res) {

    const session = await getServerSession(authOptions);

    // if (!session) {
    //     return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //         status: 401,
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });
    // }

    const {selectedMetrics, timeFrame } = await req.json();

    const authHeader = req.headers.get('Authorization');
    const authNonce = req.headers.get('Xauth');
    const token = authHeader

    const bytes = crypto.AES.decrypt(token, process.env.NEXT_PUBLIC_SECRET);
    const decryptedText = bytes.toString(crypto.enc.Utf8);
    const [receivedNonce, apiKey] = decryptedText.split(':');

    if (receivedNonce !== authNonce) {
      return res.status(400).json({ message: 'Nonce mismatch or replay detected' });
    }

    try {

          async function fetchCampaignMetrics(key, selectedMetric) {

                  try {
                    const response = await fetch(`https://a.klaviyo.com/api/campaign-values-reports/`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'revision': '2024-07-15',
                        'Authorization': `Klaviyo-API-Key ${key}`,
                      },
                      body: JSON.stringify({
                        data: {
                          type: 'campaign-values-report',
                          attributes: {
                            statistics: [
                              'average_order_value',
                              'bounce_rate',
                              'bounced_or_failed',
                              'bounced_or_failed_rate',
                              'click_rate',
                              'click_to_open_rate',
                              'clicks',
                              'clicks_unique',
                              'conversion_rate',
                              'conversion_uniques',
                              'conversion_value',
                              'conversions',
                              'delivered',
                              'delivery_rate',
                              'failed',
                              'failed_rate',
                              'open_rate',
                              'opens',
                              'opens_unique',
                              'recipients',
                              'revenue_per_recipient',
                              'spam_complaint_rate',
                              'spam_complaints',
                              'unsubscribe_rate',
                              'unsubscribe_uniques',
                              'unsubscribes',
                            ],
                            timeframe: {
                              key: timeFrame,
                            },
                            conversion_metric_id: `${selectedMetric}`,
                          },
                        },
                      }),
                    });
          
                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(`Failed to fetch metrics: ${errorData.detail || response.statusText}`);
                    }
          
                    const data = await response.json();
                    return data.data;
                    
                  } catch (error) {
              console.error('An error occurred during the metric fetching process:', error);
              throw error;
            }
          }

        // Add a 5-second delay between requests
        const metrics = await fetchCampaignMetrics(apiKey, selectedMetrics);
        return new Response(JSON.stringify(metrics), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
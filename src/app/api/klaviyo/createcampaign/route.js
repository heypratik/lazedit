import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import crypto from 'crypto-js';

function formatDateString(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function returnArr(audience) {
    let arr = [];

    // For each obj in arr get the id and return it in a new array
    audience.forEach(obj => {
        arr.push(obj.id);
    });

    return arr;
}

export async function POST(req, res) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const {selectedSegments, excludedSegments, date, subject, senderName, senderEmail, replyToEmail, campaignName} = await req.json();

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
        const response = await fetch("https://a.klaviyo.com/api/campaigns/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Klaviyo-API-Key ${apiKey}`,
                "revision": "2024-07-15"
            },
            body: JSON.stringify({"data": {
                "type": "campaign",
                "attributes": {
                    "audiences": {
                        "included": returnArr(selectedSegments),
                        "excluded": returnArr(excludedSegments)
                    },
                    "send_strategy": {
                        "options_sto": {
                            "date": formatDateString(date),
                        },
                        "method": "smart_send_time"
                    },
                    "send_options": {
                        "use_smart_sending": true
                    },
                    "campaign-messages": {
                        "data": [
                            {
                                "type": "campaign-message",
                                "attributes": {
                                    "content": {
                                        "subject": subject,
                                        "from_email": senderEmail,
                                        "from_label": senderName,
                                        "reply_to_email": replyToEmail,
                                    },
                                    "render_options": {
                                        "shorten_links": true,
                                        "add_org_prefix": true,
                                        "add_info_link": true,
                                        "add_opt_out_language": false
                                    },
                                    "channel": "email"
                                }
                            }
                        ]
                    },
                    "name": campaignName
                }
            }})
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(errorText, {
                status: response.status,
                statusText: response.statusText
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
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
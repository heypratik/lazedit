import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import crypto from 'crypto-js';

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


    const {selectedHtml, campaignName} = await req.json();

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
        const response = await fetch("https://a.klaviyo.com/api/templates/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Klaviyo-API-Key ${apiKey}`,
                "revision": "2024-07-15"
            },
            body: JSON.stringify({
                "data": {
                  "type": "template",
                  "attributes": {
                    "name": `${campaignName} - Used Template`,
                    "html": selectedHtml,
                    "text": "TEST",
                    "editor_type": "CODE"
                  }
                }
              })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error:', errorText);
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
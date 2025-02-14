import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import crypto from 'crypto-js';


export async function GET(req, res) {

  const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

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
      const response = await fetch("https://a.klaviyo.com/api/lists", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Klaviyo-API-Key ${apiKey}`,
          "revision": "2024-07-15"
        },
      });
  
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch data from Klaviyo API" });
      }
  
      const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
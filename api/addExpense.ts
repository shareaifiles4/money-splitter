import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const GOOGLE_APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzb6GGNy_ZuZ1QGnjOZIkMg67ZfOUBPBvGN2DtH04YtwaM87ZYCvU5SO-TWSKyA_Dcq/exec";

// This function will handle all requests to /api/addExpense
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const response = await fetch(`${GOOGLE_APP_SCRIPT_URL}?action=addExpense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body) // The request body is passed directly
    });

    // Check if the fetch was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google App Script Error:', errorText);
      return res.status(response.status).json({ error: 'Failed to forward request to Google App Script.' });
    }

    const data = await response.json();
    
    // Set CORS headers for the response to the browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
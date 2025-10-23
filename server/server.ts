import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// Enable CORS for all origins
app.use(cors({ origin: '*' }));
app.use(express.json());

const GOOGLE_APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzb6GGNy_ZuZ1QGnjOZIkMg67ZfOUBPBvGN2DtH04YtwaM87ZYCvU5SO-TWSKyA_Dcq/exec";

app.post('/addExpense', async (req, res) => {
  try {
    const response = await fetch(`${GOOGLE_APP_SCRIPT_URL}?action=addExpense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Proxy running on port 3001"));

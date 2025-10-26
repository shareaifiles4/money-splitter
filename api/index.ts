import express, { Request, Response } from 'express';
import cors from 'cors';
import fetch, { BodyInit, Headers } from 'node-fetch';
import multer from 'multer';
import FormData from 'form-data';
import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Enable CORS for all origins
app.use(cors({ origin: '*' }));
app.use(express.json());

const GOOGLE_APP_SCRIPT_URL = process.env.GOOGLE_APP_SCRIPT_URL;
const OCR_BACKEND_URL = process.env.OCR_BACKEND_URL;

if (!OCR_BACKEND_URL) {
  console.error("FATAL: OCR_BACKEND_URL is not set in your .env.local file.");
  process.exit(1);
}

// Generic proxy handler for Google Sheets
// Fix: Use correct Request and Response types from express to resolve type errors.
const googleSheetsProxy = async (req: Request, res: Response) => {
  const action = req.path.split('/').pop();
  let url = `${GOOGLE_APP_SCRIPT_URL}?action=${action}`;
  let body: BodyInit | undefined = undefined;
  const headers = new Headers({ 'Content-Type': 'application/json' });

  try {
    if (req.method === 'POST') {
      body = JSON.stringify(req.body);
    } else if (req.method === 'GET') {
      const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
      if (queryParams) {
        url += `&${queryParams}`;
      }
    }

    const response = await fetch(url, {
      method: req.method,
      headers: req.method === 'POST' ? headers : undefined,
      body: body,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err: any) {
    res.status(500).json({ error: `Failed to proxy request to Google Sheets: ${err.message}` });
  }
};

// Proxy for FastAPI receipt scanning
// Fix: Use correct Request and Response types from express.
app.post('/api/scanReceipt', upload.single('files'), async (req: Request, res: Response) => {
  // Fix: Cast req to `any` to access the `file` property added by multer.
  const file = (req as any).file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const formData = new FormData();
    formData.append('files', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
    });
    formData.append('language', req.body.language || 'German');

    const ocrResponse = await fetch(`${OCR_BACKEND_URL}/extract_receipts/`, {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
    });

    if (!ocrResponse.ok) {
        const errorText = await ocrResponse.text();
        console.error("FastAPI backend error:", errorText);
        return res.status(ocrResponse.status).send(errorText);
    }

    const data = await ocrResponse.json();
    res.json(data);

  } catch (err: any) {
    console.error("Error forwarding to OCR backend:", err);
    res.status(500).json({ error: `Failed to connect to OCR backend: ${err.message}` });
  }
});

// Google Sheets proxy routes
app.get('/api/getExpenses', googleSheetsProxy);
app.get('/api/fetchSummary', googleSheetsProxy);
app.post('/api/addExpense', googleSheetsProxy);
app.post('/api/updateExpense', googleSheetsProxy);
app.post('/api/addBatchExpenses', googleSheetsProxy);

export default app;
// app.listen(3001, () => console.log("Local proxy server running on http://localhost:3001"));
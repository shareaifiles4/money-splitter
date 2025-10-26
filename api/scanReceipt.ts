import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { formidable } from 'formidable';
import fs from 'fs';

// This function needs to be told to accept multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  
  const OCR_BACKEND_URL = process.env.OCR_BACKEND_URL;
  if (!OCR_BACKEND_URL) {
    console.error("OCR_BACKEND_URL is not set.");
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const imageFile = files.files?.[0];
    const language = fields.language?.[0] || 'German';

    if (!imageFile) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const formData = new FormData();
    formData.append('files', fs.createReadStream(imageFile.filepath), {
      filename: imageFile.originalFilename || 'receipt.jpg',
      contentType: imageFile.mimetype || 'image/jpeg',
    });
    formData.append('language', language);
    
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
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);

  } catch (error: any) {
    console.error('Error forwarding to OCR backend:', error);
    return res.status(500).json({ error: 'Failed to process receipt image.', details: error.message });
  }
}

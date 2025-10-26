import { OCRItem } from '../types';

const API_PROXY_URL = "/api/scanReceipt";

export const scanReceipt = async (imageFile: File): Promise<OCRItem[]> => {
    const formData = new FormData();
    // The backend expects 'files' and 'language' fields.
    formData.append('files', imageFile, imageFile.name);
    formData.append('language', 'German');

    try {
        const response = await fetch(API_PROXY_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("OCR API Error:", errorBody);
            throw new Error(`Failed to scan receipt. The server responded with status ${response.status}.`);
        }

        const data = await response.json();
        
        // The backend returns a specific JSON structure.
        if (data.receipts && data.receipts.length > 0) {
            const items = data.receipts[0].items;
            return items.filter((item: any) => 
                item && 
                typeof item.item === 'string' && 
                typeof item.price === 'number' && 
                typeof item.quantity === 'number'
            );
        }

        return [];

    } catch (error) {
        console.error("Error calling the OCR service:", error);
        throw new Error("Failed to connect to the receipt scanning service. Please check the proxy and backend.");
    }
};
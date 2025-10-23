
import { GoogleGenAI, Type } from "@google/genai";
import { OCRItem } from '../types';

const receiptSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            item: {
                type: Type.STRING,
                description: 'The name of the purchased item, e.g., "Organic Milk" or "Apples". Exclude any promotional text, discounts, or item codes.',
            },
            cost: {
                type: Type.NUMBER,
                description: 'The final price of the item after any discounts. Do not include currency symbols.',
            },
        },
        required: ['item', 'cost'],
    },
};

export const scanReceipt = async (base64Image: string): Promise<OCRItem[]> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        throw new Error("API key is not configured.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Image,
                        },
                    },
                    {
                        text: `Analyze this receipt. Extract each distinct item and its price. Ignore taxes, subtotals, totals, store information, and any other non-item text. Provide the output in the specified JSON format.`,
                    },
                ],
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: receiptSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        if (Array.isArray(parsedData)) {
            return parsedData.filter(item => item && typeof item.item === 'string' && typeof item.cost === 'number');
        }

        return [];

    } catch (error) {
        console.error("Error scanning receipt with Gemini API:", error);
        throw new Error("Failed to parse receipt. The image might be unclear or the format not recognized.");
    }
};

// geminiService.ts
// This file acts as a live API Service for the application.
import type { Expense, ScannedItem, Person } from '../types';

const API_PROXY_URL = "/api"; // your proxy

// Read URLs from environment variables
const GOOGLE_APP_SCRIPT_URL =
  process.env.GOOGLE_APP_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzb6GGNy_ZuZ1QGnjOZIkMg67ZfOUBPBvGN2DtH04YtwaM87ZYCvU5SO-TWSKyA_Dcq/exec";

const OCR_API_URL =
  process.env.OCR_API_URL || "https://your-ocr-api-endpoint.com/scan";

// Helper function to check for missing environment variables
const checkEnvVars = () => {
  if (!GOOGLE_APP_SCRIPT_URL || !OCR_API_URL) {
    console.error(
      "Missing environment variables: GOOGLE_APP_SCRIPT_URL or OCR_API_URL is not set."
    );
    throw new Error(
      "Application is not configured correctly. Please check environment variables."
    );
  }
};

// Helper function: format date to DD/MM/YYYY
function formatDateToDMY(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

type ManualExpense = Omit<Expense, "id">;

// Fetch all expenses from Google Sheet
export const fetchExpenses = async (): Promise<Expense[]> => {
  checkEnvVars();
  const response = await fetch(`${GOOGLE_APP_SCRIPT_URL}?action=getExpenses`);
  if (!response.ok) {
    throw new Error("Failed to fetch expenses from Google Sheet");
  }
  const data = await response.json();
  return data.expenses || [];
};

// Add a single manual expense via proxy
export const addManualExpense = async (expense: ManualExpense) => {
  // Format date before sending
  const formattedExpense = { ...expense, date: formatDateToDMY(expense.date) };

  // The path now directly matches your file in the /api folder
  const response = await fetch(`${API_PROXY_URL}/addExpense`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedExpense),
  });

  if (!response.ok) {
    throw new Error("Failed to add expense via proxy");
  }

  return await response.json();
};

// Scan receipt via OCR API
export const scanReceipt = async (imageUri: string): Promise<ScannedItem[]> => {
  checkEnvVars();
  const response = await fetch(OCR_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageUri }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OCR API Error:", errorText);
    throw new Error("Failed to scan receipt with OCR service.");
  }

  const data = await response.json();
  return data.items || [];
};

// Add multiple expenses at once
export const addBatchExpenses = async (
  items: Omit<Expense, "id">[]
): Promise<{ success: boolean }> => {
  checkEnvVars();

  // Format all dates
  const formattedItems = items.map((item) => ({
    ...item,
    date: formatDateToDMY(item.date),
  }));

  const response = await fetch(
    `${GOOGLE_APP_SCRIPT_URL}?action=addBatchExpenses`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: formattedItems }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add batch expenses to Google Sheet");
  }

  return await response.json();
};

// Fetch summary of expenses for a given month/year
export const fetchSummary = async (
  month: string,
  year: string
): Promise<{ [key in Person]: number }> => {
  checkEnvVars();
  const response = await fetch(
    `${GOOGLE_APP_SCRIPT_URL}?action=getSummary&month=${month}&year=${year}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch summary from Google Sheet");
  }

  const data = await response.json();
  return data.summary || {};
};

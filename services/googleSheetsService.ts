import type { Expense, Person, SummaryData } from '../types';

const API_PROXY_URL = "/api"; 

// Helper function: format date to DD/MM/YYYY
function formatDateToDMY(dateStr: string): string {
  // If date is already in DD/MM/YYYY, return it
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  // Otherwise, assume it's YYYY-MM-DD or a Date object and format it
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

type ManualExpense = Omit<Expense, "id">;

// Fetch all expenses from Google Sheet via proxy
export const fetchExpenses = async (): Promise<Expense[]> => {
  const response = await fetch(`${API_PROXY_URL}/getExpenses`);
  if (!response.ok) {
    throw new Error("Failed to fetch expenses from proxy");
  }
  const data = await response.json();
  const expenses: Expense[] = data.expenses || [];
  // Provide a default quantity for older entries that might not have one
  return expenses.map(exp => ({...exp, quantity: exp.quantity || 1}));
};

// Add a single manual expense via proxy
export const addManualExpense = async (expense: ManualExpense) => {
  const formattedExpense = { ...expense, date: formatDateToDMY(expense.date) };

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

// Update an expense via proxy
export const updateExpense = async (expense: Expense): Promise<{ updatedExpense: Expense }> => {
  const formattedExpense = { ...expense, date: formatDateToDMY(expense.date) };

  const response = await fetch(`${API_PROXY_URL}/updateExpense`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedExpense),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Update Expense Error:", errorBody);
    throw new Error("Failed to update expense via proxy");
  }

  return await response.json();
};

// Add multiple expenses at once via proxy
export const addBatchExpenses = async (
  items: Omit<Expense, "id">[]
): Promise<{ success: boolean }> => {
  const formattedItems = items.map((item) => ({
    ...item,
    date: formatDateToDMY(item.date),
  }));

  const response = await fetch(`${API_PROXY_URL}/addBatchExpenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: formattedItems }),
  });

  if (!response.ok) {
    throw new Error("Failed to add batch expenses via proxy");
  }

  return await response.json();
};

// Fetch summary of expenses for a given month/year via proxy
export const fetchSummary = async (
  month: string,
  year: string
): Promise<SummaryData> => {
  const response = await fetch(`${API_PROXY_URL}/fetchSummary?month=${month}&year=${year}`);

  if (!response.ok) {
    throw new Error("Failed to fetch summary via proxy");
  }

  const data = await response.json();
  return data.summary || {};
};

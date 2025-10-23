
import { Expense, SummaryData, AssignedItem } from '../types';

// !IMPORTANT: In a real application, you would replace the mock logic in these functions
// with `fetch` calls to your actual Google Apps Script Web App URL.
// const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

let mockExpenses: Expense[] = [
    { id: '1', item: 'Apples', cost: 4.5, person: 'Zohair', date: '2025-10-22' },
    { id: '2', item: 'Milk', cost: 1.8, person: 'Mohsin', date: '2025-10-21' },
    { id: '3', item: 'Bread', cost: 2.2, person: 'Zohair', date: '2025-10-21' },
];

export const fetchExpenses = async (): Promise<Expense[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockExpenses].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, 1000);
  });
};

export const addManualExpense = async (expense: Omit<Expense, 'id'>): Promise<{ success: boolean; newExpense: Expense }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Added Expense:', expense);
      const newExpense = { ...expense, id: Math.random().toString(36).substring(2, 9) };
      mockExpenses.push(newExpense);
      resolve({ success: true, newExpense });
    }, 500);
  });
};

export const addBatchExpenses = async (items: AssignedItem[]): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Added Batch:', items);
       const newExpenses: Expense[] = items.map(item => ({
        ...item,
        id: Math.random().toString(36).substring(2, 9),
        person: item.person!,
        date: new Date().toISOString().split('T')[0],
      }));
      mockExpenses.push(...newExpenses);
      resolve({ success: true });
    }, 1000);
  });
};

export const fetchSummary = async (month: string, year: string): Promise<SummaryData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Fetching summary for:', month, year);
      // This is a simplified mock. A real backend would filter by month/year.
      resolve({
        Zohair: 125.5,
        Mohsin: 95.75,
      });
    }, 1000);
  });
};

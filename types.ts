
export type Person = 'Zohair' | 'Mohsin';

export interface OCRItem {
  item: string;
  cost: number;
}

export interface AssignedItem extends OCRItem {
  person: string | null;
}

export interface SummaryData {
  [key: string]: number;
}

export interface AlertInfo {
  visible: boolean;
  title: string;
  message: string;
}

export interface Expense {
  id: string;
  item: string;
  cost: number;
  person: Person;
  date: string; // Using string as in user's example: '2025-10-22'
}

export interface ScannedItem {
  item: string;
  cost: number;
}

export interface AssignableScannedItem extends ScannedItem {
    person: Person | null;
}

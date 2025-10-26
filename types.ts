export type Person = 'Zohair' | 'Mohsin';
export type FilterPerson = Person | 'All';

export interface OCRItem {
  item: string;
  quantity: number;
  price: number;
}

export interface AssignedItem extends OCRItem {
  person: Person | 'None' | null;
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
  quantity: number;
}
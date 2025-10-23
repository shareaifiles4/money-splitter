
export interface Expense {
  id: string;
  item: string;
  cost: number;
  person: string;
  date: string;
}

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

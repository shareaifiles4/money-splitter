
import React from 'react';
import { Plus } from 'lucide-react';
import { Expense } from '../types';
import { CURRENCY } from '../constants';

interface HomeScreenProps {
  expenses: Expense[];
  onShowAddModal: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ expenses, onShowAddModal }) => (
  <div className="relative flex h-full flex-col p-4 animate-in fade-in-0">
    <h1 className="mb-5 text-3xl font-bold text-gray-800">Recent Expenses</h1>
    <div className="flex-grow overflow-y-auto pb-20">
      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 text-center">
          <p className="text-lg text-gray-600">No expenses yet.</p>
          <p className="text-sm text-gray-500">Tap the '+' button to add one!</p>
        </div>
      ) : (
        expenses.map((exp) => (
          <div key={exp.id} className="mb-3 rounded-lg bg-white p-4 shadow-sm">
            <div className="flex justify-between">
              <p className="text-lg font-semibold text-gray-800">{exp.item}</p>
              <p className="text-lg font-semibold text-gray-800">{CURRENCY}{exp.cost.toFixed(2)}</p>
            </div>
            <div className="mt-1 flex justify-between">
              <p className="text-sm text-gray-500">Paid by: {exp.person}</p>
              <p className="text-sm text-gray-500">{exp.date}</p>
            </div>
          </div>
        ))
      )}
    </div>
    <button
      onClick={onShowAddModal}
      className="absolute bottom-20 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      aria-label="Add Expense"
    >
      <Plus className="h-8 w-8" />
    </button>
  </div>
);

export default HomeScreen;

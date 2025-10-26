import React, { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Expense, FilterPerson } from '../types';
import { CURRENCY, FILTER_OPTIONS } from '../constants';

interface HomeScreenProps {
  expenses: Expense[];
  onShowAddModal: () => void;
  onEditExpense: (expense: Expense) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ expenses, onShowAddModal, onEditExpense }) => {
  const [filter, setFilter] = useState<FilterPerson>('All');

  const filteredExpenses = expenses.filter(exp => filter === 'All' || exp.person === filter);
  
  return (
    <div className="relative flex h-full flex-col p-4 animate-in fade-in-0">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">Recent Expenses</h1>
      
      <div className="mb-4 flex rounded-lg bg-gray-200 p-1">
        {FILTER_OPTIONS.map(option => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all ${
              filter === option
                ? 'bg-white text-emerald-600 shadow'
                : 'bg-transparent text-gray-600 hover:bg-white/50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto pb-20">
        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <p className="text-lg text-gray-600">No expenses found.</p>
            <p className="text-sm text-gray-500">Try changing the filter or adding an expense.</p>
          </div>
        ) : (
          filteredExpenses.map((exp) => (
            <div key={exp.id} className="mb-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between">
                <div>
                    <p className="text-lg font-semibold text-gray-800">{exp.item}</p>
                    <p className="mt-1 text-sm text-gray-500">Owes To: {exp.person}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-gray-800">{CURRENCY}{exp.cost.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-gray-500">{exp.date}</p>
                </div>
              </div>
              <div className="mt-2 border-t border-gray-100 pt-2">
                 <button
                    onClick={() => onEditExpense(exp)}
                    className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                    aria-label={`Edit ${exp.item}`}
                >
                    <Pencil className="h-3 w-3 mr-1.5" />
                    Edit
                </button>
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
};

export default HomeScreen;
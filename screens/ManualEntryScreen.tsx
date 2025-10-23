
import React, { useState } from 'react';
import { Expense } from '../types';
import { CURRENCY, PEOPLE } from '../constants';
import AppButton from '../components/AppButton';

interface ManualEntryScreenProps {
  onNavigate: (screen: string) => void;
  onSave: (expense: Omit<Expense, 'id'>) => void;
  showAlert: (title: string, message: string) => void;
}

const ManualEntryScreen: React.FC<ManualEntryScreenProps> = ({ onNavigate, onSave, showAlert }) => {
  const [item, setItem] = useState('');
  const [cost, setCost] = useState('');
  const [person, setPerson] = useState(PEOPLE[0]);

  const handleSave = () => {
    const costFloat = parseFloat(cost);
    if (!item.trim() || isNaN(costFloat) || costFloat <= 0) {
      showAlert('Invalid Input', 'Please fill out all fields correctly. Cost must be a positive number.');
      return;
    }
    onSave({ item: item.trim(), cost: costFloat, person, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="flex h-full flex-col p-4 animate-in fade-in-0">
      <h1 className="mb-5 text-3xl font-bold text-gray-800">Add Manually</h1>
      <div className="flex-grow space-y-4 overflow-y-auto">
        <div>
          <label className="mb-2 block text-base font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-3 text-base text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="e.g., Bananas"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-base font-medium text-gray-700">Cost ({CURRENCY})</label>
          <input
            type="number"
            inputMode="decimal"
            className="w-full rounded-lg border border-gray-300 p-3 text-base text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="e.g., 2.99"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-base font-medium text-gray-700">Paid By</label>
          <div className="grid grid-cols-2 gap-3">
            {PEOPLE.map((p) => (
              <button
                key={p}
                onClick={() => setPerson(p)}
                className={`flex-1 rounded-lg border p-3 text-base font-semibold transition-all ${
                  person === p
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <AppButton title="Save Expense" onClick={handleSave} />
        <div className="my-3" />
        <AppButton title="Back" variant="secondary" onClick={() => onNavigate('Home')} />
      </div>
    </div>
  );
};

export default ManualEntryScreen;

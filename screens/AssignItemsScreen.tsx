import React, { useState } from 'react';
import { OCRItem, AssignedItem } from '../types';
import { CURRENCY, PEOPLE } from '../constants';
import AppButton from '../components/AppButton';

interface AssignItemsScreenProps {
  items: OCRItem[];
  onNavigate: (screen: string) => void;
  onSaveBatch: (items: AssignedItem[]) => void;
  showAlert: (title: string, message: string) => void;
}

const AssignItemsScreen: React.FC<AssignItemsScreenProps> = ({ items, onNavigate, onSaveBatch, showAlert }) => {
  // FIX: Corrected the state type to be an array of objects, not an intersection of an object and an array.
  const [assignedItems, setAssignedItems] = useState<(Omit<AssignedItem, 'person' | 'cost'> & { person: string | null; cost: string })[]>(
    items.map((item) => ({ ...item, cost: String(item.cost.toFixed(2)), person: null })),
  );

  const updateItem = (index: number, field: 'item' | 'cost' | 'person', value: string | null) => {
    const newItems = [...assignedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setAssignedItems(newItems);
  };

  const handleSaveAll = () => {
    const finalItems: AssignedItem[] = [];
    for (const item of assignedItems) {
      const costFloat = parseFloat(item.cost);
      if (!item.item || isNaN(costFloat) || costFloat <= 0) {
        showAlert('Invalid Item', `Please check the details for "${item.item || 'an item'}". Cost must be a positive number.`);
        return;
      }
      if (!item.person) {
        showAlert('Missing Assignment', `Please assign a person to "${item.item}".`);
        return;
      }
      finalItems.push({ ...item, cost: costFloat, person: item.person });
    }
    onSaveBatch(finalItems);
  };

  return (
    <div className="flex h-full flex-col p-4 animate-in fade-in-0">
      <h1 className="mb-5 text-3xl font-bold text-gray-800">Assign Items</h1>
      <div className="flex-grow overflow-y-auto pb-32">
        {assignedItems.map((item, index) => (
          <div key={index} className="mb-3 rounded-lg bg-white p-4 shadow-sm">
            <input
              type="text"
              value={item.item}
              onChange={(e) => updateItem(index, 'item', e.target.value)}
              className="w-full rounded-md border-b border-gray-200 p-1 text-lg font-semibold text-gray-800 focus:border-emerald-500 focus:outline-none"
            />
            <div className="mt-3 flex items-center">
              <span className="text-lg text-gray-500">{CURRENCY}</span>
              <input
                type="number"
                value={item.cost}
                onChange={(e) => updateItem(index, 'cost', e.target.value)}
                className="ml-1 w-full flex-1 rounded-md border-b border-gray-200 p-1 text-lg font-semibold text-gray-800 focus:border-emerald-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {PEOPLE.map((p) => (
                <button
                  key={p}
                  onClick={() => updateItem(index, 'person', p)}
                  className={`flex-1 rounded-md border py-2 text-sm font-semibold transition-all ${
                    item.person === p
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-gray-100/80 p-4 pt-2 backdrop-blur-sm md:left-1/2 md:max-w-md md:-translate-x-1/2">
        <AppButton title="Save All Items" onClick={handleSaveAll} />
        <div className="my-3" />
        <AppButton title="Back" variant="secondary" onClick={() => onNavigate('Scan')} />
      </div>
    </div>
  );
};

export default AssignItemsScreen;

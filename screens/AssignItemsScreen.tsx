import React, { useState } from 'react';
import { OCRItem, AssignedItem, Person } from '../types';
import { CURRENCY, ASSIGNMENT_OPTIONS } from '../constants';
import AppButton from '../components/AppButton';

interface AssignItemsScreenProps {
  items: OCRItem[];
  onNavigate: (screen: string) => void;
  onSaveBatch: (items: AssignedItem[]) => void;
  showAlert: (title: string, message: string) => void;
}

type EditableAssignedItem = Omit<AssignedItem, 'price' | 'quantity'> & {
  price: string; // Price per item
  quantity: string;
};

const AssignItemsScreen: React.FC<AssignItemsScreenProps> = ({ items, onNavigate, onSaveBatch, showAlert }) => {
  const [assignedItems, setAssignedItems] = useState<EditableAssignedItem[]>(
    items.map((item) => {
        const pricePerItem = item.quantity > 0 ? item.price / item.quantity : item.price;
        return { 
            ...item, 
            price: String(pricePerItem.toFixed(2)), 
            quantity: String(item.quantity),
            person: 'None' 
        };
    }),
  );

  const updateItem = (index: number, field: 'item' | 'price' | 'person' | 'quantity', value: string | Person | 'None' | null) => {
    const newItems = [...assignedItems];
    // Create a new object to ensure React state updates correctly
    const currentItem = { ...newItems[index] };
    
    if (field === 'item') {
      currentItem.item = value as string;
    } else if (field === 'price') {
      currentItem.price = value as string;
    } else if (field === 'quantity') {
      currentItem.quantity = value as string;
    } else if (field === 'person') {
      currentItem.person = value as Person | 'None' | null;
    }

    newItems[index] = currentItem;
    setAssignedItems(newItems);
  };

  const handleSaveAll = () => {
    const finalItems: AssignedItem[] = [];
    for (const item of assignedItems) {
      const priceFloat = parseFloat(item.price);
      const quantityInt = parseInt(item.quantity, 10);

      if (!item.item.trim()) {
        showAlert('Invalid Item', `An item is missing a name. Please check your list.`);
        return;
      }
      if (isNaN(priceFloat) || priceFloat < 0) {
        showAlert('Invalid Price', `Please enter a valid, non-negative price for "${item.item}".`);
        return;
      }
      if (isNaN(quantityInt) || quantityInt <= 0 || !Number.isInteger(quantityInt)) {
        showAlert('Invalid Quantity', `Please enter a valid, positive whole number for the quantity of "${item.item}".`);
        return;
      }
      if (!item.person) {
        showAlert('Missing Assignment', `Please assign a person to "${item.item}" or select 'None'.`);
        return;
      }
      finalItems.push({ 
        ...item, 
        item: item.item.trim(),
        price: priceFloat, 
        quantity: quantityInt,
        person: item.person
      });
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
             <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="text-lg text-gray-500">{CURRENCY}</span>
                    <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                        className="ml-1 w-24 flex-1 rounded-md border-b border-gray-200 p-1 text-lg font-semibold text-gray-800 focus:border-emerald-500 focus:outline-none"
                        placeholder="0.00"
                    />
                </div>
                <div className="flex items-center">
                    <span className="text-md text-gray-600 mr-1">Qty:</span>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        className="w-16 rounded-md border-b border-gray-200 p-1 text-right text-md font-semibold text-gray-800 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {ASSIGNMENT_OPTIONS.map((p) => (
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
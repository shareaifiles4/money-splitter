import React, { useState, useEffect } from 'react';
import { Expense } from '../types';
import { CURRENCY, PEOPLE } from '../constants';
import AppButton from '../components/AppButton';

interface EditExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  expense: Expense | null;
  showAlert: (title: string, message: string) => void;
}

// Helper to convert DD/MM/YYYY string to YYYY-MM-DD for the date input
const formatDateForInput = (d: string): string => {
  if (!d || !/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
    // Fallback to today if format is invalid or not provided
    return new Date().toISOString().split('T')[0];
  }
  const [day, month, year] = d.split('/');
  return `${year}-${month}-${day}`;
};


const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ visible, onClose, onSave, expense, showAlert }) => {
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [person, setPerson] = useState(PEOPLE[0]);
  const [date, setDate] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (expense) {
      const itemPrice = expense.quantity > 0 ? expense.cost / expense.quantity : expense.cost;
      setItem(expense.item);
      setPrice(String(itemPrice.toFixed(2)));
      setQuantity(String(expense.quantity || 1));
      setPerson(expense.person);
      setDate(formatDateForInput(expense.date));
    }
  }, [expense]);

  useEffect(() => {
      const priceFloat = parseFloat(price);
      const quantityInt = parseInt(quantity, 10);
      if (!isNaN(priceFloat) && !isNaN(quantityInt) && quantityInt > 0) {
          setTotalCost(priceFloat * quantityInt);
      } else {
          setTotalCost(0);
      }
  }, [price, quantity]);

  const handleSave = () => {
    const priceFloat = parseFloat(price);
    const quantityInt = parseInt(quantity, 10);

    if (!item.trim() || isNaN(priceFloat) || priceFloat < 0 || isNaN(quantityInt) || quantityInt <= 0 || !Number.isInteger(quantityInt)) {
      showAlert('Invalid Input', 'Please fill out all fields correctly. Price and quantity must be positive whole numbers.');
      return;
    }
    if (!expense) return;

    onSave({ 
      ...expense, 
      item: item.trim(), 
      cost: priceFloat * quantityInt, 
      person, 
      date,
      quantity: quantityInt
    });
  };

  if (!visible || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-5 text-center text-xl font-bold text-gray-800">Edit Expense</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-base font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 p-3 text-base text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-base font-medium text-gray-700">Price per item ({CURRENCY})</label>
              <input
                type="number"
                inputMode="decimal"
                className="w-full rounded-lg border border-gray-300 p-3 text-base text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-base font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                inputMode="numeric"
                className="w-full rounded-lg border border-gray-300 p-3 text-base text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                step="1"
              />
            </div>
          </div>
          <div>
            <p className="text-right text-gray-800">
              Total Cost: <span className="font-bold">{CURRENCY}{totalCost.toFixed(2)}</span>
            </p>
          </div>
           <div>
            <label className="mb-2 block text-base font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 p-3 text-base text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-base font-medium text-gray-700">Owes To</label>
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
        <div className="mt-6 space-y-3">
          <AppButton title="Save Changes" onClick={handleSave} />
          <AppButton title="Cancel" variant="secondary" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default EditExpenseModal;
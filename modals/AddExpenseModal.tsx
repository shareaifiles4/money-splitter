
import React from 'react';
import AppButton from '../components/AppButton';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ visible, onClose, onNavigate }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 pb-8 animate-in slide-in-from-bottom-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-5 text-center text-xl font-bold text-gray-800">Add Expense</h2>
        <AppButton
          title="Scan a Receipt"
          onClick={() => {
            onClose();
            onNavigate('Scan');
          }}
        />
        <div className="my-3" />
        <AppButton
          title="Add Manually"
          onClick={() => {
            onClose();
            onNavigate('ManualEntry');
          }}
        />
        <div className="my-5" />
        <AppButton title="Cancel" variant="secondary" onClick={onClose} />
      </div>
    </div>
  );
};

export default AddExpenseModal;

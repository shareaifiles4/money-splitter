
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import AppButton from './AppButton';

interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const CustomAlertModal: React.FC<CustomAlertModalProps> = ({ visible, title, message, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95">
        <div className="flex items-start">
          <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <AppButton title="OK" onClick={onClose} className="sm:w-auto" />
        </div>
      </div>
    </div>
  );
};

export default CustomAlertModal;

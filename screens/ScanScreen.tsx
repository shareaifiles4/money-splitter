import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import AppButton from '../components/AppButton';

interface ScanScreenProps {
  onNavigate: (screen: string) => void;
  onScan: (file: File) => void;
  showAlert: (title: string, message: string) => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onNavigate, onScan, showAlert }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // The onScan function is called, but the App component
      // is configured to use mock data regardless of this file.
      onScan(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-4 animate-in fade-in-0">
      <h1 className="mb-5 text-3xl font-bold text-gray-800">Scan Receipt</h1>
      <Camera className="h-32 w-32 text-emerald-500" />
      <p className="my-6 max-w-xs text-center text-lg text-gray-600">
        Use your camera or select a photo of your receipt to get started.
      </p>
      <div className="w-full max-w-xs">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          capture="environment" 
        />
        <AppButton title="Take/Select Photo" onClick={handleButtonClick} />
        <div className="my-3" />
        <AppButton title="Back" variant="secondary" onClick={() => onNavigate('Home')} />
      </div>
    </div>
  );
};

export default ScanScreen;
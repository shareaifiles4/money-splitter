
import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import AppButton from '../components/AppButton';

interface ScanScreenProps {
  onNavigate: (screen: string) => void;
  onScan: (base64Image: string) => void;
  showAlert: (title: string, message: string) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // remove data:image/jpeg;base64, prefix
        resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};


const ScanScreen: React.FC<ScanScreenProps> = ({ onNavigate, onScan, showAlert }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini Flash
        showAlert('File Too Large', 'Please select an image smaller than 4MB.');
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        onScan(base64);
      } catch (error) {
        console.error("Error converting file to base64", error);
        showAlert('File Error', 'Could not process the selected image file.');
      }
    }
  };

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-4 animate-in fade-in-0">
      <h1 className="mb-5 text-3xl font-bold text-gray-800">Scan Receipt</h1>
      <Camera className="h-32 w-32 text-emerald-500" />
      <p className="my-6 max-w-xs text-center text-lg text-gray-600">
        Take a picture of your receipt to automatically add items.
      </p>
      <div className="w-full max-w-xs">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
        />
        <AppButton title="Take or Select Photo" onClick={handleScanClick} />
        <div className="my-3" />
        <AppButton title="Back" variant="secondary" onClick={() => onNavigate('Home')} />
      </div>
    </div>
  );
};

export default ScanScreen;

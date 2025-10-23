
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Processing..." }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
    <p className="mt-3 text-lg font-medium text-gray-800">{message}</p>
  </div>
);

export default LoadingOverlay;

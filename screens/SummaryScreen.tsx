
import React, { useState } from 'react';
import { SummaryData } from '../types';
import { CURRENCY, PEOPLE } from '../constants';
import AppButton from '../components/AppButton';

interface SummaryScreenProps {
  onFetchSummary: (month: string, year: string) => void;
  summary: SummaryData | null;
  error: string;
  showAlert: (title: string, message: string) => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ onFetchSummary, summary, error, showAlert }) => {
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const handleFetch = () => {
    if (!month || !year || !/^\d{2}$/.test(month) || !/^\d{4}$/.test(year)) {
      showAlert('Invalid Date', 'Please enter a 2-digit month (e.g., 09) and 4-digit year (e.g., 2025).');
      return;
    }
    onFetchSummary(month, year);
  };

  return (
    <div className="flex h-full flex-col p-4 animate-in fade-in-0">
      <h1 className="mb-5 text-3xl font-bold text-gray-800">Monthly Summary</h1>
      <div className="flex space-x-3">
        <input
          type="text"
          className="w-1/2 rounded-lg border border-gray-300 p-3 text-base text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          placeholder="Month (MM)"
          value={month}
          onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))}
          maxLength={2}
        />
        <input
          type="text"
          className="w-1/2 rounded-lg border border-gray-300 p-3 text-base text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          placeholder="Year (YYYY)"
          value={year}
          onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
          maxLength={4}
        />
      </div>
      <div className="my-4" />
      <AppButton title="Get Summary" onClick={handleFetch} />
      <div className="my-5" />

      {summary ? (
        <div className="rounded-lg bg-white p-6 shadow-sm animate-in fade-in-0">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-800">
            Totals for {month}/{year}
          </h2>
          {PEOPLE.map((p) => (
            <div key={p} className="flex justify-between border-b border-gray-100 py-3 last:border-b-0">
              <span className="text-lg text-gray-700">{p}:</span>
              <span className="text-xl font-bold text-emerald-500">
                {CURRENCY}{summary[p]?.toFixed(2) || '0.00'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Press the button to load summary data.</p>
      )}

      {error && <p className="mt-4 text-center text-base text-red-500">{error}</p>}
    </div>
  );
};

export default SummaryScreen;


import React, { useState, useEffect, useCallback } from 'react';
import { Expense, OCRItem, SummaryData, AlertInfo, AssignedItem } from './types';
import { fetchExpenses, addManualExpense, addBatchExpenses, fetchSummary } from './services/googleSheetsService';
import { scanReceipt } from './services/geminiService';
import HomeScreen from './screens/HomeScreen';
import ManualEntryScreen from './screens/ManualEntryScreen';
import ScanScreen from './screens/ScanScreen';
import AssignItemsScreen from './screens/AssignItemsScreen';
import SummaryScreen from './screens/SummaryScreen';
import AddExpenseModal from './modals/AddExpenseModal';
import CustomAlertModal from './components/CustomAlertModal';
import LoadingOverlay from './components/LoadingOverlay';
import BottomNav from './components/BottomNav';
import { Loader2 } from 'lucide-react';

type Screen = 'Home' | 'ManualEntry' | 'Scan' | 'AssignItems' | 'Summary';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [showAddModal, setShowAddModal] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [ocrResults, setOcrResults] = useState<OCRItem[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading Expenses...');
  const [error, setError] = useState('');
  const [alertModal, setAlertModal] = useState<AlertInfo>({ visible: false, title: '', message: '' });

  const showAlert = (title: string, message: string) => {
    setAlertModal({ visible: true, title, message });
  };
  
  const loadInitialExpenses = useCallback(async () => {
    setLoading(true);
    setLoadingMessage('Loading Expenses...');
    try {
        const data = await fetchExpenses();
        setExpenses(data);
    } catch (err) {
        setError('Failed to load expenses.');
        showAlert('Loading Error', 'Could not load initial expense data.');
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setError('');
    if(screen === 'Summary') setSummary(null);
  };

  const handleAddManual = async (expense: Omit<Expense, 'id'>) => {
    setLoading(true);
    setLoadingMessage('Saving Expense...');
    try {
      const { newExpense } = await addManualExpense(expense);
      setExpenses([newExpense, ...expenses]);
      handleNavigate('Home');
    } catch (err) {
      setError('Failed to save expense.');
      showAlert('Save Error', 'Could not save the new expense.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanReceipt = async (base64Image: string) => {
    setLoading(true);
    setLoadingMessage('Scanning Receipt...');
    try {
      const items = await scanReceipt(base64Image);
      if (items.length === 0) {
        showAlert('Scan Unsuccessful', 'Could not find any items on the receipt. Please try a clearer image.');
        setLoading(false);
        return;
      }
      setOcrResults(items);
      handleNavigate('AssignItems');
    } catch (err) {
      setError('Failed to scan receipt.');
      showAlert('Scan Error', (err as Error).message || 'An unknown error occurred during scanning.');
      handleNavigate('Home');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBatch = async (items: AssignedItem[]) => {
    setLoading(true);
    setLoadingMessage('Saving Items...');
    try {
      await addBatchExpenses(items);
      await loadInitialExpenses();
      handleNavigate('Home');
    } catch (err) {
      setError('Failed to save batch.');
      showAlert('Save Error', 'Could not save the batch of expenses.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSummary = async (month: string, year: string) => {
    setLoading(true);
    setLoadingMessage('Fetching Summary...');
    setError('');
    setSummary(null);
    try {
      const data = await fetchSummary(month, year);
      setSummary(data);
    } catch (err) {
      setError('Failed to load summary.');
       showAlert('Fetch Error', 'Could not load the summary data.');
    } finally {
      setLoading(false);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen expenses={expenses} onShowAddModal={() => setShowAddModal(true)} />;
      case 'ManualEntry':
        return <ManualEntryScreen onNavigate={handleNavigate} onSave={handleAddManual} showAlert={showAlert} />;
      case 'Scan':
        return <ScanScreen onNavigate={handleNavigate} onScan={handleScanReceipt} showAlert={showAlert} />;
      case 'AssignItems':
        return <AssignItemsScreen items={ocrResults} onNavigate={handleNavigate} onSaveBatch={handleSaveBatch} showAlert={showAlert} />;
      case 'Summary':
        return <SummaryScreen onFetchSummary={handleFetchSummary} summary={summary} error={error} showAlert={showAlert} />;
      default:
        return <HomeScreen expenses={expenses} onShowAddModal={() => setShowAddModal(true)} />;
    }
  };

  if (loading && expenses.length === 0 && currentScreen === 'Home') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="mt-3 text-lg font-medium text-gray-800">{loadingMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
        <div className="relative mx-auto min-h-screen max-w-md bg-gray-100 shadow-lg">
            <main className="h-full pb-16">{renderScreen()}</main>

            {['Home', 'Summary'].includes(currentScreen) && (
                <BottomNav currentScreen={currentScreen as 'Home' | 'Summary'} onNavigate={handleNavigate as (screen: 'Home' | 'Summary') => void} />
            )}

            <AddExpenseModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onNavigate={(screen) => handleNavigate(screen as Screen)}
            />

            <CustomAlertModal
                visible={alertModal.visible}
                title={alertModal.title}
                message={alertModal.message}
                onClose={() => setAlertModal({ visible: false, title: '', message: '' })}
            />

            {loading && <LoadingOverlay message={loadingMessage} />}
        </div>
    </div>
  );
}

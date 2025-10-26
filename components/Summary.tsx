
import React from 'react';
// Fix: Use the existing 'Expense' type instead of the non-existent 'GroceryItem'.
import { type Expense, Person } from '../types';

interface SummaryProps {
    items: Expense[];
    people: Person[];
}

const Summary: React.FC<SummaryProps> = ({ items, people }) => {
    const calculateMonthlySummary = () => {
        const summary: { [month: string]: { [key in Person]?: number } & { total: number } } = {};

        items.forEach(item => {
            // Fix: Create a Date object from the date string before calling toLocaleString.
            const month = new Date(item.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!summary[month]) {
                summary[month] = { total: 0 };
                people.forEach(p => summary[month][p] = 0);
            }
            if(summary[month][item.person] !== undefined) {
               summary[month][item.person]! += item.cost;
            }
            summary[month].total += item.cost;
        });

        return Object.entries(summary).sort(([monthA], [monthB]) => new Date(monthB).getTime() - new Date(monthA).getTime());
    };

    const monthlySummaries = calculateMonthlySummary();

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold">Monthly Summary</h2>
            {monthlySummaries.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">No expenses recorded yet.</p>
            ) : (
                <div className="space-y-6">
                    {monthlySummaries.map(([month, data]) => (
                        <div key={month} className="border-t border-slate-200 dark:border-slate-700 pt-4">
                            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{month}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Total: €{data.total.toFixed(2)}</p>
                            <ul className="space-y-1">
                                {people.map(person => (
                                    <li key={person} className="flex justify-between items-center text-sm">
                                        <span>{person}</span>
                                        <span className="font-semibold font-mono">€{(data[person] || 0).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Summary;

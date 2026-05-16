
import { 
  LayoutDashboard, Package, FileText, Settings, Users,
  AlertTriangle, Download, Plus, Edit, Trash2, Printer, FilterX, ArrowUpDown,
  RotateCcw, X, Moon, Sun
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import React, { useState } from 'react';
import { UNITS, GST_RATES, getDaysToExpiry, generateBarcode, today } from '../utils/constants';
import { DEFAULT_CATEGORIES, DUMMY_DATA, DUMMY_SUPPLIERS, getTheme } from '../utils/constants';

const Reports = ({ inventory, theme }) => {
    const exportToCSV = () => {
    // 1. Fix headers: Make them a SINGLE comma-separated string
    const headers = "Product Id,Product Name,Category,Qty/Unit,Cost Price(₹),Selling Price(₹),GST (%),Mfg Date,Expiry Date,Barcode";
    
    // 2. Fix data formatting
    const rows = inventory.map(i => {
      // Wrap name in quotes in case a product name has a comma in it (e.g. "Apple, Green")
      const safeName = `"${i.name || ''}"`;
      // Fix undefined cost price
      const costPrice = i.costPrice || 0;
      // Fix scientific notation in Excel by formatting barcode as a formula string ="..."
      const safeBarcode = `="${i.barcode}"`;
      
      return `${i.productId},${safeName},${i.category},${i.quantity} ${i.unit},${costPrice},${i.price},${i.gst},${i.mfgDate},${i.expDate},${safeBarcode}`;
    });

    // 3. Add UTF-8 BOM (\uFEFF) so Excel reads the ₹ symbol correctly
    const csvContent = "\uFEFF" + headers + "\n" + rows.join("\n");
    
    // 4. Safely create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 no-print">
      <h2 className={`text-2xl font-bold ${theme.textMain} mb-6`}>Actionable Reports</h2>
       <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-6 mb-6 flex justify-between items-center`}>
        <div><h3 className={`text-lg font-semibold ${theme.textMain} mb-1`}>Export Full Data</h3><p className={`${theme.textMuted} text-sm`}>Download inventory data as a CSV file for Excel.</p></div>
        <button onClick={exportToCSV} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"><Download className="w-4 h-4" /> Download CSV</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-5">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Low Stock Alerts</h3>
          <ul className="space-y-3">{inventory.filter(i => Number(i.quantity) < 10).map(i => <li key={i.id} className={`flex justify-between items-center ${theme.bgCard} p-3 rounded-lg border ${theme.border}`}><span className={`font-medium ${theme.textMain}`}>{i.name}</span><span className="text-red-600 font-bold">{i.quantity} {i.unit}</span></li>)}</ul>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-5">
          <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-500 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Expiring Soon (20 Days)</h3>
          <ul className="space-y-3">{inventory.filter(i => { const d = getDaysToExpiry(i.expDate); return d >= 0 && d <= 20; }).map(i => <li key={i.id} className={`flex justify-between items-center ${theme.bgCard} p-3 rounded-lg border ${theme.border}`}><span className={`font-medium ${theme.textMain}`}>{i.name}</span><span className="text-yellow-600 font-bold">in {getDaysToExpiry(i.expDate)} days</span></li>)}</ul>
        </div>
         <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-5">
          <h3 className="text-lg font-bold text-orange-800 dark:text-orange-500 mb-4 flex items-center gap-2"><X className="w-5 h-5"/> Expired Items</h3>
          <ul className="space-y-3">{inventory.filter(i => getDaysToExpiry(i.expDate) < 0).map(i => <li key={i.id} className={`flex justify-between items-center ${theme.bgCard} p-3 rounded-lg border ${theme.border}`}><span className={`font-medium ${theme.textMain}`}>{i.name}</span><span className="text-orange-600 font-bold text-sm">Expired</span></li>)}</ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
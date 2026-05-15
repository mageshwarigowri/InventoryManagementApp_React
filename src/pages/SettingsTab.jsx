import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, FileText, Settings, Users,
  Plus, Edit, Trash2, AlertTriangle, Download,
  RotateCcw, ArrowUpDown, X, Printer, Moon, Sun, FilterX
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { DEFAULT_CATEGORIES, DUMMY_DATA, DUMMY_SUPPLIERS, getTheme } from '../utils/constants';

const SettingsTab = ({ isDarkMode, setIsDarkMode, setInventory, setSuppliers, setCategories, theme }) => {
  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500 no-print">
      <h2 className={`text-2xl font-bold ${theme.textMain} mb-6`}>System Settings</h2>
      <div className={`${theme.bgCard} rounded-xl shadow-sm border ${theme.border} p-6 space-y-8`}>
        <div>
          <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>Appearance</h3>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${theme.border} ${theme.hover} ${theme.textMain} transition-all font-medium`}>
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500"/> : <Moon className="w-5 h-5 text-indigo-500"/>} {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>Data Management</h3>
          <div className={`p-4 ${isDarkMode ? 'bg-red-900/10' : 'bg-red-50'} rounded-lg border border-red-200 dark:border-red-900`}>
            <button onClick={() => { if (window.confirm('Wipe all data?')) { setInventory(DUMMY_DATA); setSuppliers(DUMMY_SUPPLIERS); setCategories(DEFAULT_CATEGORIES); } }} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 shadow-sm"><RotateCcw className="w-4 h-4" /> Restore Default Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
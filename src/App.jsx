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
import { DEFAULT_CATEGORIES, DUMMY_DATA, DUMMY_SUPPLIERS, getTheme } from './utils/constants';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import SettingsTab from './pages/SettingsTab';

export default function App() {
const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('groceryInventory');
    return saved && saved !== '[]' ? JSON.parse(saved) : DUMMY_DATA;
  });
  
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('grocerySuppliers');
    return saved && saved !== '[]' ? JSON.parse(saved) : DUMMY_SUPPLIERS;
  });
  
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('groceryCategories');
    return saved && saved !== '[]' ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('groceryTheme') === 'dark';
  });

  useEffect(() => {
    setInventory(JSON.parse(localStorage.getItem('groceryInventory')) || DUMMY_DATA);
    setSuppliers(JSON.parse(localStorage.getItem('grocerySuppliers')) || DUMMY_SUPPLIERS);
    setCategories(JSON.parse(localStorage.getItem('groceryCategories')) || DEFAULT_CATEGORIES);
    setIsDarkMode(localStorage.getItem('groceryTheme') === 'dark');
  }, []);

  useEffect(() => { localStorage.setItem('groceryInventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('grocerySuppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('groceryCategories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('groceryTheme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);

  const theme = getTheme(isDarkMode);

  return (
    <div className={`min-h-screen ${theme.bgMain} font-sans flex flex-col md:flex-row transition-colors duration-200`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap');
        @media print {
          .no-print { display: none !important; }
          body, main { background: white !important; padding: 0 !important; margin: 0 !important; }
          .print-table-container { position: absolute; top: 0; left: 0; width: 100%; border: none !important; box-shadow: none !important; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc !important; color: black !important; background: white !important; padding: 8px !important;}
        }
      `}</style>

      {/* RENDER THE SIDEBAR COMPONENT */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        {/* RENDER THE ACTIVE PAGE BASED ON STATE */}
        {activeTab === 'dashboard' && <Dashboard inventory={inventory} categories={categories} theme={theme} isDarkMode={isDarkMode} />}
        {activeTab === 'inventory' && <Inventory inventory={inventory} setInventory={setInventory} categories={categories} setCategories={setCategories} theme={theme} isDarkMode={isDarkMode} />}
        {activeTab === 'suppliers' && <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} theme={theme} isDarkMode={isDarkMode} />}
        {activeTab === 'reports'   && <Reports inventory={inventory} theme={theme} />}
        {activeTab === 'settingstab'  && <SettingsTab isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setInventory={setInventory} setSuppliers={setSuppliers} setCategories={setCategories} theme={theme} />}
      </main>
    </div>
  );
}

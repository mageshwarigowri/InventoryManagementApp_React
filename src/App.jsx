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
import { DEFAULT_CATEGORIES, DUMMY_DATA, DUMMY_SUPPLIERS, getTheme, DUMMY_INVOICES } from './utils/constants';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import SettingsTab from './pages/SettingsTab';
import Billing from './pages/Billing';

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

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('groceryInvoices');
    return saved && saved !== '[]' ? JSON.parse(saved) : DUMMY_INVOICES;
  });
  
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('groceryCategories');
    return saved && saved !== '[]' ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [sales, setSales] = useState(() => {
  const saved = localStorage.getItem('grocerySales');
  return saved && saved !== '[]' ? JSON.parse(saved) : [];
});

const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('groceryCustomers');
    return saved && saved !== '[]' ? JSON.parse(saved) : [];
  });

  const [discountRules, setDiscountRules] = useState(() => {
    const saved = localStorage.getItem('groceryDiscountRules');
    return saved && saved !== '[]' ? JSON.parse(saved) : [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('groceryTheme') === 'dark');

  useEffect(() => { localStorage.setItem('groceryInventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('grocerySuppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('groceryInvoices', JSON.stringify(invoices)); }, [invoices]); // NEW EFFECT
  useEffect(() => { localStorage.setItem('groceryCategories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('groceryTheme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);
  useEffect(() => { localStorage.setItem('grocerySales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('groceryCustomers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('groceryDiscountRules', JSON.stringify(discountRules)); }, [discountRules]);

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

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        {activeTab === 'dashboard' && <Dashboard inventory={inventory} categories={categories} theme={theme} isDarkMode={isDarkMode} />}
        {activeTab === 'inventory' && <Inventory inventory={inventory} setInventory={setInventory} categories={categories} setCategories={setCategories} discountRules={discountRules} setDiscountRules={setDiscountRules} theme={theme} isDarkMode={isDarkMode} />}
        {activeTab === 'suppliers' && <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} theme={theme} isDarkMode={isDarkMode} />}
        {activeTab === 'invoices'  && <Invoices invoices={invoices} setInvoices={setInvoices} inventory={inventory} setInventory={setInventory} suppliers={suppliers} theme={theme} isDarkMode={isDarkMode} />}
        {activeTab === 'reports'   && <Reports inventory={inventory} theme={theme} />}
        {activeTab === 'billing'   && <Billing invoices={invoices} setInvoices={setInvoices} inventory={inventory} setInventory={setInventory} sales={sales} setSales={setSales} customers={customers} setCustomers={setCustomers} theme={theme} isDarkMode={isDarkMode} />}
        {activeTab === 'settingstab'  && <SettingsTab isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} inventory={inventory} setInventory={setInventory} suppliers={suppliers} setSuppliers={setSuppliers} invoices={invoices} setInvoices={setInvoices} categories={categories} setCategories={setCategories} sales={sales} setSales={setSales} customers={customers} setCustomers={setCustomers} discountRules={discountRules} setDiscountRules={setDiscountRules} theme={theme} />}
      </main>
    </div>
  );
}

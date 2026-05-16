import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, FileText, Settings, Users, Receipt,
  Plus, Edit, Trash2, AlertTriangle, Download,
  RotateCcw, ArrowUpDown, X, Printer, Moon, Sun, FilterX
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';


const Sidebar = ({ activeTab, setActiveTab, theme }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'suppliers', icon: Users, label: 'Suppliers' },
    { id: 'invoices', icon: Receipt, label: 'Invoices' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settingstab', icon: Settings, label: 'SettingsTab' }
  ];

  return (
    <nav className={`w-full md:w-64 ${theme.bgSidebar} border-r px-4 py-6 flex flex-col gap-2 shadow-sm no-print z-10`}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="bg-green-100 p-2 rounded-lg"><Package className="text-green-600 w-6 h-6" /></div>
        <h1 className={`text-xl font-bold ${theme.textMain}`}>FreshStock</h1>
      </div>
      {navItems.map(item => (
        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id ? 'bg-green-600 text-white font-semibold shadow-md' : `${theme.textMuted} ${theme.hover}`}`}>
          <item.icon className="w-5 h-5" /> {item.label}
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
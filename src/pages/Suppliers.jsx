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

const Suppliers = ({ suppliers, setSuppliers, theme, isDarkMode }) => {
  const [isSupFormOpen, setIsSupFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const SupplierForm = () => {
    const [formData, setFormData] = useState(editingItem || { supplierId: `SUP-${Math.floor(100 + Math.random() * 900)}`, name: '', contactPerson: '', email: '', mobile: '', gstNumber: '' });
    const handleSubmit = (e) => {
      e.preventDefault();
      const payload = { ...formData, id: editingItem ? editingItem.id : Date.now().toString() };
      if (editingItem) setSuppliers(suppliers.map(s => s.id === payload.id ? payload : s));
      else setSuppliers([...suppliers, payload]);
      setIsSupFormOpen(false); setEditingItem(null);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`${theme.bgCard} ${theme.border} border rounded-xl p-6 w-full max-w-md`}>
          <h2 className={`text-xl font-bold mb-6 ${theme.textMain}`}>{editingItem ? 'Edit Supplier' : 'Add New Supplier'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['supplierId', 'name', 'contactPerson', 'email', 'mobile', 'gstNumber'].map(field => (
               <input key={field} required type={field === 'email' ? 'email' : 'text'} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={formData[field]} onChange={e => setFormData({...formData, [field]: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} />
            ))}
            <div className="flex justify-end gap-3 mt-6 pt-4"><button type="button" onClick={() => { setIsSupFormOpen(false); setEditingItem(null); }} className={`px-4 py-2 border rounded-lg ${theme.textMain}`}>Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button></div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 no-print">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme.textMain}`}>Suppliers Directory</h2>
        <button onClick={() => setIsSupFormOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" /> Add Supplier</button>
      </div>
      <div className={`${theme.bgCard} rounded-xl shadow-sm border ${theme.border} overflow-hidden`}>
        <table className="w-full text-left">
          <thead>
            <tr className={`${theme.tableHeader} text-sm border-b`}><th className="p-4 font-semibold">ID</th><th className="p-4 font-semibold">Company</th><th className="p-4 font-semibold">Contact Person</th><th className="p-4 font-semibold">Contact Info</th><th className="p-4 font-semibold">GSTIN</th><th className="p-4 font-semibold text-center">Actions</th></tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {suppliers.map(sup => (
              <tr key={sup.id} className={theme.tableRow}>
                <td className={`p-4 font-medium ${theme.textMain}`}>{sup.supplierId}</td><td className={`p-4 font-bold ${theme.textMain}`}>{sup.name}</td><td className={`p-4 ${theme.textMain}`}>{sup.contactPerson}</td>
                <td className="p-4"><div className={theme.textMain}>{sup.mobile}</div><div className={`text-xs ${theme.textMuted}`}>{sup.email}</div></td><td className={`p-4 font-mono text-sm ${theme.textMain}`}>{sup.gstNumber}</td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => {setEditingItem(sup); setIsSupFormOpen(true);}} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => { if(window.confirm('Delete supplier?')) setSuppliers(suppliers.filter(s => s.id !== sup.id)); }} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isSupFormOpen && <SupplierForm />}
    </div>
  );
};

export default Suppliers;
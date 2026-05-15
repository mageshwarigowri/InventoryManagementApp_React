import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, FileText, Settings, Users,
  Plus, Edit, Trash2, AlertTriangle, Download,
  RotateCcw, ArrowUpDown, X, Printer, Moon, Sun, FilterX
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Core Configurations
const DEFAULT_CATEGORIES = ['Grains', 'Dairy', 'Fruits', 'Vegetables', 'Bakery', 'Beverages'];
const UNITS = ['kg', 'g', 'L', 'ml', 'packet', 'box', 'piece', 'dozen'];
const GST_RATES = ['0', '5', '12', '18', '28'];
const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const generateBarcode = () => Math.floor(100000000000 + Math.random() * 900000000000).toString();

const DUMMY_DATA = [
  { id: '1', productId: 'PRD-1001', name: 'Basmati Rice', category: 'Grains', quantity: 20, unit: 'kg', price: 450, gst: '5', mfgDate: '2023-10-01', expDate: '2024-10-01', barcode: generateBarcode() },
  { id: '2', productId: 'PRD-1002', name: 'Whole Milk', category: 'Dairy', quantity: 15, unit: 'L', price: 60, gst: '0', mfgDate: '2024-05-10', expDate: '2024-05-15', barcode: generateBarcode() },
  { id: '3', productId: 'PRD-1003', name: 'Apples', category: 'Fruits', quantity: 30, unit: 'kg', price: 120, gst: '0', mfgDate: '2024-05-08', expDate: '2024-05-20', barcode: generateBarcode() },
  { id: '4', productId: 'PRD-1004', name: 'Wheat Bread', category: 'Bakery', quantity: 10, unit: 'packet', price: 40, gst: '0', mfgDate: '2024-05-12', expDate: '2024-05-18', barcode: generateBarcode() },
  { id: '5', productId: 'PRD-1005', name: 'Orange Juice', category: 'Beverages', quantity: 25, unit: 'box', price: 110, gst: '12', mfgDate: '2024-04-01', expDate: '2024-10-01', barcode: generateBarcode() },
  { id: '6', productId: 'PRD-1006', name: 'Onions', category: 'Vegetables', quantity: 50, unit: 'kg', price: 30, gst: '0', mfgDate: '2024-05-01', expDate: '2024-06-01', barcode: generateBarcode() }
];

const DUMMY_SUPPLIERS = [
  { id: '1', supplierId: 'SUP-001', name: 'Dairy Farms Inc.', contactPerson: 'John Doe', email: 'orders@dairyfarms.com', mobile: '9876543210', gstNumber: '22AAAAA0000A1Z5' },
  { id: '2', supplierId: 'SUP-002', name: 'AgriCorp Wholesale', contactPerson: 'Jane Smith', email: 'supply@agricorp.in', mobile: '9123456789', gstNumber: '33BBBBB1111B2Z6' }
];

export default function App() {
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Modals & Editing
  const [isInvFormOpen, setIsInvFormOpen] = useState(false);
  const [isSupFormOpen, setIsSupFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Table Features
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Load Initial Data
  useEffect(() => {
    const savedInv = localStorage.getItem('groceryInventory');
    const savedSup = localStorage.getItem('grocerySuppliers');
    const savedCat = localStorage.getItem('groceryCategories');
    const savedTheme = localStorage.getItem('groceryTheme');
    
    setInventory(savedInv ? JSON.parse(savedInv) : DUMMY_DATA);
    setSuppliers(savedSup ? JSON.parse(savedSup) : DUMMY_SUPPLIERS);
    setCategories(savedCat ? JSON.parse(savedCat) : DEFAULT_CATEGORIES);
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  // Save Data on Change
  useEffect(() => { localStorage.setItem('groceryInventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('grocerySuppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('groceryCategories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('groceryTheme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);

  const today = new Date().toISOString().split('T')[0];

  const theme = {
    bgMain: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',
    bgSidebar: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    bgCard: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    textMain: isDarkMode ? 'text-gray-100' : 'text-gray-800',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    tableHeader: isDarkMode ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-gray-50 text-gray-600 border-gray-200',
    tableRow: isDarkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    chartText: isDarkMode ? '#e5e7eb' : '#374151',
    chartGrid: isDarkMode ? '#374151' : '#e5e7eb'
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({});

  let processedInventory = [...inventory];
  
  // Apply Filters
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      processedInventory = processedInventory.filter(item => 
        String(item[key]).toLowerCase().includes(String(filters[key]).toLowerCase())
      );
    }
  });

  // Apply Sorting
  if (sortConfig.key) {
    processedInventory.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (['quantity', 'price', 'gst'].includes(sortConfig.key)) {
        return sortConfig.direction === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
      }
      return sortConfig.direction === 'asc' 
        ? String(aVal).localeCompare(String(bVal)) 
        : String(bVal).localeCompare(String(aVal));
    });
  }

  const exportToCSV = () => {
    const headers = ['Product ID,Item Name,Category,Quantity,Unit,Price (₹),GST (%),Barcode,Total Value (₹),Mfg Date,Expiry Date'];
    const rows = processedInventory.map(i => 
      `${i.productId},${i.name},${i.category},${i.quantity},${i.unit},${i.price},${i.gst},${i.barcode},${i.quantity*i.price},${i.mfgDate},${i.expDate}`
    );
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + headers.concat(rows).join("\n"));
    link.download = "filtered_inventory.csv";
    link.click();
  };

  const InventoryForm = () => {
    const [formData, setFormData] = useState(editingItem || {
      productId: `PRD-${Math.floor(1000 + Math.random() * 9000)}`, name: '', category: categories[0], 
      quantity: '', unit: 'kg', price: '', gst: '0', mfgDate: '', expDate: '', barcode: ''
    });
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Handle custom category
      let finalCategory = formData.category;
      if (isCustomCategory && customCategory.trim() !== '') {
        finalCategory = customCategory.trim();
        if (!categories.includes(finalCategory)) {
          setCategories([...categories, finalCategory]);
        }
      }

      const payload = {
        ...formData,
        category: finalCategory,
        id: editingItem ? editingItem.id : Date.now().toString(),
        barcode: formData.barcode || generateBarcode()
      };

      if (editingItem) setInventory(inventory.map(i => i.id === payload.id ? payload : i));
      else setInventory([...inventory, payload]);
      
      setIsInvFormOpen(false);
      setEditingItem(null);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`${theme.bgCard} ${theme.border} border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
          <h2 className={`text-xl font-bold mb-6 ${theme.textMain}`}>{editingItem ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Product ID</label>
                <input required type="text" value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} className={`w-full rounded-md px-3 py-2 border focus:ring-2 focus:ring-green-500 outline-none ${theme.input}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Item Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full rounded-md px-3 py-2 border focus:ring-2 focus:ring-green-500 outline-none ${theme.input}`} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Category</label>
                {!isCustomCategory ? (
                  <select value={formData.category} onChange={e => {
                      if(e.target.value === 'ADD_NEW') setIsCustomCategory(true);
                      else setFormData({...formData, category: e.target.value});
                    }} className={`w-full rounded-md px-3 py-2 border outline-none ${theme.input}`}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="ADD_NEW" className="font-bold text-green-600">+ Add New Category</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input required autoFocus type="text" placeholder="New Category Name" value={customCategory} onChange={e => setCustomCategory(e.target.value)} className={`flex-1 rounded-md px-3 py-2 border outline-none ${theme.input}`} />
                    <button type="button" onClick={() => setIsCustomCategory(false)} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button>
                  </div>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Barcode</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} placeholder="Auto-generate if empty" className={`flex-1 rounded-md px-3 py-2 border outline-none ${theme.input}`} />
                  <button type="button" onClick={() => setFormData({...formData, barcode: generateBarcode()})} className={`px-3 py-2 border rounded-md text-sm ${theme.hover} ${theme.textMain} ${theme.border}`}>Generate</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Quantity</label>
                <input required min="0" type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className={`w-full rounded-md px-3 py-2 border outline-none ${theme.input}`} />
              </div>
              <div className="col-span-2">
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Unit</label>
                <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className={`w-full rounded-md px-3 py-2 border outline-none ${theme.input}`}>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Price (₹)</label>
                <input required min="0" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`w-full rounded-md px-3 py-2 border outline-none ${theme.input}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>GST (%)</label>
                <select value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} className={`w-full rounded-md px-3 py-2 border outline-none ${theme.input}`}>
                  {GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Mfg Date</label>
                {/* VALIDATION: max={today} prevents future dates */}
                <input required max={today} type="date" value={formData.mfgDate} onChange={e => setFormData({...formData, mfgDate: e.target.value})} className={`w-full rounded-md px-3 py-2 border outline-none ${theme.input}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Expiry Date</label>
                <input required type="date" value={formData.expDate} onChange={e => setFormData({...formData, expDate: e.target.value})} className={`w-full rounded-md px-3 py-2 border outline-none ${theme.input}`} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => { setIsInvFormOpen(false); setEditingItem(null); }} className={`px-4 py-2 border rounded-lg ${theme.textMain} ${theme.hover} ${theme.border}`}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm">Save Product</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const SupplierForm = () => {
    const [formData, setFormData] = useState(editingItem || {
      supplierId: `SUP-${Math.floor(100 + Math.random() * 900)}`, name: '', contactPerson: '', email: '', mobile: '', gstNumber: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const payload = { ...formData, id: editingItem ? editingItem.id : Date.now().toString() };
      if (editingItem) setSuppliers(suppliers.map(s => s.id === payload.id ? payload : s));
      else setSuppliers([...suppliers, payload]);
      setIsSupFormOpen(false);
      setEditingItem(null);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`${theme.bgCard} ${theme.border} border rounded-xl p-6 w-full max-w-md`}>
          <h2 className={`text-xl font-bold mb-6 ${theme.textMain}`}>{editingItem ? 'Edit Supplier' : 'Add New Supplier'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="text" placeholder="Supplier ID" value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} />
            <input required type="text" placeholder="Company Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} />
            <input required type="text" placeholder="Contact Person" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} />
            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} />
            <input required type="text" placeholder="Mobile Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} />
            <input required type="text" placeholder="GST Number" value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} />
            
            <div className="flex justify-end gap-3 mt-6 pt-4">
              <button type="button" onClick={() => { setIsSupFormOpen(false); setEditingItem(null); }} className={`px-4 py-2 border rounded-lg ${theme.textMain} ${theme.hover} ${theme.border}`}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Supplier</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const metrics = {
    totalItems: inventory.length,
    totalQuantity: inventory.reduce((sum, item) => sum + Number(item.quantity), 0),
    totalValue: inventory.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0),
    lowStock: inventory.filter(item => Number(item.quantity) < 10).length,
    expired: inventory.filter(item => item.expDate < today).length
  };

  const categoryData = categories.map(cat => ({
    name: cat, 
    value: inventory.filter(i => i.category === cat).reduce((sum, i) => sum + Number(i.quantity), 0)
  })).filter(cat => cat.value > 0);

  // Data for the new Bar Chart (Top 10 items by Quantity)
  const barChartData = [...inventory]
    .sort((a, b) => Number(b.quantity) - Number(a.quantity))
    .slice(0, 10)
    .map(item => ({ name: item.name, quantity: Number(item.quantity) }));

  // Helper for expiry
  const getDaysToExpiry = (expDate) => {
    return Math.ceil((new Date(expDate) - new Date(today)) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={`min-h-screen ${theme.bgMain} font-sans flex flex-col md:flex-row transition-colors duration-200`}>
      {/* Styles for Printing and Barcode */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap');
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body, main { background: white !important; padding: 0 !important; margin: 0 !important; }
          .print-table-container { position: absolute; top: 0; left: 0; width: 100%; border: none !important; box-shadow: none !important; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc !important; color: black !important; background: white !important; padding: 8px !important;}
        }
      `}</style>

      {/* Sidebar Navigation */}
      <nav className={`w-full md:w-64 ${theme.bgSidebar} border-r px-4 py-6 flex flex-col gap-2 shadow-sm no-print z-10`}>
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="bg-green-100 p-2 rounded-lg"><Package className="text-green-600 w-6 h-6" /></div>
          <h1 className={`text-xl font-bold ${theme.textMain}`}>FreshStock</h1>
        </div>
        
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'inventory', icon: Package, label: 'Inventory' },
          { id: 'suppliers', icon: Users, label: 'Suppliers' },
          { id: 'reports', icon: FileText, label: 'Reports' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === item.id 
              ? 'bg-green-600 text-white font-semibold shadow-md' 
              : `${theme.textMuted} ${theme.hover}`
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        
        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500 no-print">
            <h2 className={`text-2xl font-bold ${theme.textMain} mb-6`}>Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className={`${theme.bgCard} p-6 rounded-xl border ${theme.border} shadow-sm`}>
                <span className={`${theme.textMuted} text-sm font-medium mb-1 block`}>Total Value</span>
                <span className={`text-3xl font-bold ${theme.textMain}`}>₹{metrics.totalValue.toLocaleString()}</span>
              </div>
              <div className={`${theme.bgCard} p-6 rounded-xl border ${theme.border} shadow-sm`}>
                <span className={`${theme.textMuted} text-sm font-medium mb-1 block`}>Total Stock</span>
                <span className={`text-3xl font-bold ${theme.textMain}`}>{metrics.totalQuantity} <span className="text-sm font-normal">units</span></span>
              </div>
              <div className={`${theme.bgCard} p-6 rounded-xl border ${theme.border} shadow-sm`}>
                <span className={`${theme.textMuted} text-sm font-medium mb-1 block`}>Unique Products</span>
                <span className={`text-3xl font-bold ${theme.textMain}`}>{metrics.totalItems}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Pie Chart */}
              <div className={`${theme.bgCard} p-6 rounded-xl shadow-sm border ${theme.border}`}>
                <h3 className={`text-lg font-semibold ${theme.textMain} mb-6 text-center`}>Stock by Category</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                        {categoryData.map((e, i) => <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', borderColor: isDarkMode ? '#374151' : '#e5e7eb', color: theme.chartText }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Product Detail Bar Chart */}
              <div className={`${theme.bgCard} p-6 rounded-xl shadow-sm border ${theme.border}`}>
                <h3 className={`text-lg font-semibold ${theme.textMain} mb-6 text-center`}>Top 10 Products by Quantity</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
                      <XAxis dataKey="name" tick={{fill: theme.chartText, fontSize: 12}} tickLine={false} axisLine={{stroke: theme.chartGrid}} />
                      <YAxis tick={{fill: theme.chartText}} tickLine={false} axisLine={{stroke: theme.chartGrid}} />
                      <Tooltip cursor={{fill: isDarkMode ? '#374151' : '#f3f4f6'}} contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', borderColor: isDarkMode ? '#374151' : '#e5e7eb', color: theme.chartText }} />
                      <Bar dataKey="quantity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- INVENTORY TAB --- */}
        {activeTab === 'inventory' && (
          <div className="max-w-full mx-auto animate-in fade-in duration-500 print-table-container">
            <div className="flex justify-between items-center mb-6 no-print">
              <h2 className={`text-2xl font-bold ${theme.textMain}`}>Inventory Master</h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${theme.textMain} ${theme.hover} ${theme.border} shadow-sm`}>
                  <Printer className="w-4 h-4" /> Save PDF
                </button>
                <button onClick={() => setIsInvFormOpen(true)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-sm">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            </div>

            <div className={`${theme.bgCard} rounded-xl shadow-sm border ${theme.border} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`${theme.tableHeader} text-sm border-b`}>
                      {/* Sortable Headers */}
                      {[
                        { key: 'productId', label: 'ID' },
                        { key: 'name', label: 'Product Name' },
                        { key: 'category', label: 'Category' },
                        { key: 'quantity', label: 'Qty/Unit' },
                        { key: 'price', label: 'Price (₹)' },
                        { key: 'gst', label: 'GST' },
                        { key: 'barcode', label: 'Barcode' },
                        { key: 'expDate', label: 'Expiry' }
                      ].map(col => (
                        <th key={col.key} className="p-3 font-semibold whitespace-nowrap cursor-pointer hover:opacity-80" onClick={() => handleSort(col.key)}>
                          <div className="flex items-center gap-1">
                            {col.label}
                            {sortConfig.key === col.key && <ArrowUpDown className="w-3 h-3 opacity-50" />}
                          </div>
                        </th>
                      ))}
                      <th className="p-3 font-semibold text-center no-print">Actions</th>
                    </tr>
                    
                    {/* Inline Filter Row */}
                    <tr className={`${theme.bgSidebar} border-b ${theme.border} no-print`}>
                      <td className="p-2"><input type="text" placeholder="Filter ID..." onChange={(e) => handleFilterChange('productId', e.target.value)} value={filters.productId || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                      <td className="p-2"><input type="text" placeholder="Filter Name..." onChange={(e) => handleFilterChange('name', e.target.value)} value={filters.name || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                      <td className="p-2">
                        <select onChange={(e) => handleFilterChange('category', e.target.value)} value={filters.category || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}>
                          <option value="">All</option>
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td className="p-2"><input type="text" placeholder="Filter Qty..." onChange={(e) => handleFilterChange('quantity', e.target.value)} value={filters.quantity || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                      <td className="p-2"><input type="text" placeholder="Filter Price..." onChange={(e) => handleFilterChange('price', e.target.value)} value={filters.price || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                      <td className="p-2"><input type="text" placeholder="Filter GST..." onChange={(e) => handleFilterChange('gst', e.target.value)} value={filters.gst || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                      <td className="p-2"><input type="text" placeholder="Filter Barcode..." onChange={(e) => handleFilterChange('barcode', e.target.value)} value={filters.barcode || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                      <td className="p-2"></td>
                      <td className="p-2 text-center">
                        <button onClick={clearFilters} title="Clear Filters" className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"><FilterX className="w-4 h-4"/></button>
                      </td>
                    </tr>
                  </thead>

                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {processedInventory.length === 0 ? (
                      <tr><td colSpan="9" className={`p-8 text-center ${theme.textMuted}`}>No products match your criteria.</td></tr>
                    ) : (
                      processedInventory.map((item) => (
                        <tr key={item.id} className={`${theme.tableRow} transition-colors`}>
                          <td className={`p-3 text-sm font-medium ${theme.textMain}`}>{item.productId}</td>
                          <td className={`p-3 text-sm font-medium ${theme.textMain}`}>{item.name}</td>
                          <td className="p-3"><span className={`inline-block px-2 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded text-xs`}>{item.category}</span></td>
                          <td className={`p-3 text-sm ${theme.textMain}`}>{item.quantity} {item.unit}</td>
                          <td className={`p-3 text-sm ${theme.textMain}`}>₹{item.price}</td>
                          <td className={`p-3 text-sm ${theme.textMain}`}>{item.gst}%</td>
                          <td className="p-3 text-center">
                            <span className={`font-['Libre_Barcode_39'] text-3xl leading-none block ${theme.textMain}`} title={item.barcode}>*{item.barcode}*</span>
                          </td>
                          <td className="p-3 text-sm">
                            {getDaysToExpiry(item.expDate) < 0 
                              ? <span className="text-red-500 font-bold">Expired</span> 
                              : <span className={theme.textMain}>{item.expDate}</span>}
                          </td>
                          <td className="p-3 no-print">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => {setEditingItem(item); setIsInvFormOpen(true);}} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => { if(window.confirm('Delete this item?')) setInventory(inventory.filter(i => i.id !== item.id)); }} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- SUPPLIERS TAB --- */}
        {activeTab === 'suppliers' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500 no-print">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${theme.textMain}`}>Suppliers Directory</h2>
              <button onClick={() => setIsSupFormOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm">
                <Plus className="w-4 h-4" /> Add Supplier
              </button>
            </div>
            <div className={`${theme.bgCard} rounded-xl shadow-sm border ${theme.border} overflow-hidden`}>
              <table className="w-full text-left">
                <thead>
                  <tr className={`${theme.tableHeader} text-sm border-b`}>
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Company Name</th>
                    <th className="p-4 font-semibold">Contact Person</th>
                    <th className="p-4 font-semibold">Phone & Email</th>
                    <th className="p-4 font-semibold">GSTIN</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                  {suppliers.map(sup => (
                    <tr key={sup.id} className={theme.tableRow}>
                      <td className={`p-4 font-medium ${theme.textMain}`}>{sup.supplierId}</td>
                      <td className={`p-4 font-bold ${theme.textMain}`}>{sup.name}</td>
                      <td className={`p-4 ${theme.textMain}`}>{sup.contactPerson}</td>
                      <td className="p-4">
                        <div className={theme.textMain}>{sup.mobile}</div>
                        <div className={`text-xs ${theme.textMuted}`}>{sup.email}</div>
                      </td>
                      <td className={`p-4 font-mono text-sm ${theme.textMain}`}>{sup.gstNumber}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => {setEditingItem(sup); setIsSupFormOpen(true);}} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"><Edit className="w-4 h-4"/></button>
                          <button onClick={() => { if(window.confirm('Delete this supplier?')) setSuppliers(suppliers.filter(s => s.id !== sup.id)); }} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {suppliers.length === 0 && <tr><td colSpan="6" className={`p-8 text-center ${theme.textMuted}`}>No suppliers added yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- REPORTS TAB --- */}
        {activeTab === 'reports' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-500 no-print">
            <h2 className={`text-2xl font-bold ${theme.textMain} mb-6`}>Actionable Reports</h2>
            
            <div className={`${theme.bgCard} rounded-xl border ${theme.border} p-6 mb-6 flex justify-between items-center`}>
              <div>
                <h3 className={`text-lg font-semibold ${theme.textMain} mb-1`}>Export Full Data</h3>
                <p className={`${theme.textMuted} text-sm`}>Download your filtered inventory data as a CSV file for Excel.</p>
              </div>
              <button onClick={exportToCSV} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Low Stock Card */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-5">
                <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Low Stock</h3>
                <ul className="space-y-3">
                  {inventory.filter(i => Number(i.quantity) < 10).map(i => (
                    <li key={i.id} className={`flex justify-between items-center ${theme.bgCard} p-3 rounded-lg border ${theme.border}`}>
                      <span className={`font-medium ${theme.textMain}`}>{i.name}</span>
                      <span className="text-red-600 font-bold">{i.quantity} {i.unit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expiring Soon Card (Next 20 Days) */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-5">
                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-500 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Expiring Soon (20 Days)</h3>
                <ul className="space-y-3">
                  {inventory.filter(i => {
                    const days = getDaysToExpiry(i.expDate);
                    return days >= 0 && days <= 20;
                  }).map(i => (
                    <li key={i.id} className={`flex justify-between items-center ${theme.bgCard} p-3 rounded-lg border ${theme.border}`}>
                      <span className={`font-medium ${theme.textMain}`}>{i.name}</span>
                      <span className="text-yellow-600 font-bold">in {getDaysToExpiry(i.expDate)} days</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Already Expired Card */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-5">
                <h3 className="text-lg font-bold text-orange-800 dark:text-orange-500 mb-4 flex items-center gap-2"><X className="w-5 h-5"/> Expired Items</h3>
                <ul className="space-y-3">
                  {inventory.filter(i => getDaysToExpiry(i.expDate) < 0).map(i => (
                    <li key={i.id} className={`flex justify-between items-center ${theme.bgCard} p-3 rounded-lg border ${theme.border}`}>
                      <span className={`font-medium ${theme.textMain}`}>{i.name}</span>
                      <span className="text-orange-600 font-bold text-sm">Expired {Math.abs(getDaysToExpiry(i.expDate))} days ago</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-500 no-print">
            <h2 className={`text-2xl font-bold ${theme.textMain} mb-6`}>System Settings</h2>
            
            <div className={`${theme.bgCard} rounded-xl shadow-sm border ${theme.border} p-6 space-y-8`}>
              
              {/* Appearance Toggle */}
              <div>
                <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>Appearance</h3>
                <p className={`${theme.textMuted} text-sm mb-4`}>Switch between Light and Dark themes across the entire application.</p>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${theme.border} ${theme.hover} ${theme.textMain} transition-all font-medium w-full sm:w-auto`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500"/> : <Moon className="w-5 h-5 text-indigo-500"/>}
                  {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
              </div>

              {/* Data Management */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-semibold ${theme.textMain} mb-2`}>Data Management</h3>
                <p className={`${theme.textMuted} text-sm mb-4`}>Resetting will erase your current inventory and suppliers, and reload the default dummy data.</p>
                <div className={`p-4 ${isDarkMode ? 'bg-red-900/10' : 'bg-red-50'} rounded-lg border border-red-200 dark:border-red-900`}>
                  <button 
                    onClick={() => {
                      if (window.confirm('Wipe all data and restore defaults?')) {
                        setInventory(DUMMY_DATA); setSuppliers(DUMMY_SUPPLIERS); setCategories(DEFAULT_CATEGORIES);
                      }
                    }} 
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" /> Restore Default Data
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Modals Rendering */}
        {isInvFormOpen && <InventoryForm />}
        {isSupFormOpen && <SupplierForm />}

      </main>
    </div>
  );
}
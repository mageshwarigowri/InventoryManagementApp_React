import { 
  LayoutDashboard, Package, FileText, Settings, Users,
  AlertTriangle, Download, Plus, Edit, Trash2, Printer, FilterX, ArrowUpDown,
  RotateCcw, X, Moon, Sun, Tag
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import React, { useState } from 'react';
import { UNITS, GST_RATES, getDaysToExpiry, generateBarcode, today } from '../utils/constants';
import { DEFAULT_CATEGORIES, DUMMY_DATA, DUMMY_SUPPLIERS, getTheme } from '../utils/constants';

const Inventory = ({ inventory, setInventory, categories, setCategories, discountRules = [], setDiscountRules, theme, isDarkMode }) => {
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isInvFormOpen, setIsInvFormOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({});

  let processedInventory = [...inventory];
  Object.keys(filters).forEach(key => {
    if (filters[key]) processedInventory = processedInventory.filter(item => String(item[key]).toLowerCase().includes(String(filters[key]).toLowerCase()));
  });

  if (sortConfig.key) {
    processedInventory.sort((a, b) => {
      let aVal = a[sortConfig.key], bVal = b[sortConfig.key];
      if (['quantity', 'price', 'costPrice', 'gst'].includes(sortConfig.key)) return sortConfig.direction === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
      return sortConfig.direction === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
  }

  // --- MULTIPLE DISCOUNT RULES MODAL ---
  const DiscountModal = () => {
    // Load previously saved rules, or default to one empty rule
    const [rules, setRules] = useState(discountRules.length > 0 ? discountRules : [{ id: Date.now(), days: '', pct: '' }]);

    const addRule = () => setRules([...rules, { id: Date.now(), days: '', pct: '' }]);
    const removeRule = (id) => setRules(rules.filter(r => r.id !== id));
    
    const updateRule = (id, field, value) => {
      setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const applyDiscountRules = (e) => {
      e.preventDefault();
      
      const validRules = rules
        .map(r => ({ ...r, days: parseInt(r.days), pct: parseFloat(r.pct) }))
        .filter(r => !isNaN(r.days) && !isNaN(r.pct) && r.pct >= 0 && r.pct <= 100);

      if (validRules.length === 0) return alert("Please enter valid numbers for at least one rule.");

      // Save rules to App memory so they can be backed up
      setDiscountRules(validRules);

      validRules.sort((a, b) => a.days - b.days);

      let discountedCount = 0;
      
      const updatedInventory = inventory.map(item => {
        const basePrice = item.originalPrice ? Number(item.originalPrice) : Number(item.price);
        let newItem = { ...item, price: basePrice.toFixed(2) };
        if (newItem.originalPrice) delete newItem.originalPrice;

        if (!newItem.expDate) return newItem;
        const daysLeft = getDaysToExpiry(newItem.expDate);
        if (daysLeft < 0) return newItem; 

        const matchingRule = validRules.find(r => daysLeft <= r.days);
        
        if (matchingRule) {
          discountedCount++;
          const discountedPrice = basePrice - (basePrice * (matchingRule.pct / 100));
          newItem.originalPrice = basePrice;
          newItem.price = discountedPrice.toFixed(2);
        }
        
        return newItem;
      });

      setInventory(updatedInventory);
      setIsDiscountModalOpen(false);
      alert(`Success! Applied discounts to ${discountedCount} item(s) using ${validRules.length} rule(s).`);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 no-print">
        <div className={`${theme.bgCard} ${theme.border} border rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200`}>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-blue-500" />
            <h2 className={`text-xl font-bold ${theme.textMain}`}>Set Expiry Discounts</h2>
          </div>
          <p className={`text-sm ${theme.textMuted} mb-6`}>Create rules to automatically discount items nearing expiry.</p>
          
          <form onSubmit={applyDiscountRules}>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
              <div className={`grid grid-cols-5 gap-2 text-xs font-bold ${theme.textMuted} px-1`}>
                <div className="col-span-2">Expires in (Days)</div>
                <div className="col-span-2">Discount (%)</div>
                <div></div>
              </div>
              
              {rules.map((rule, index) => (
                <div key={rule.id} className="grid grid-cols-5 gap-2 items-center">
                  <div className="col-span-2">
                    <input required min="0" type="number" value={rule.days} onChange={e => updateRule(rule.id, 'days', e.target.value)} className={`w-full rounded-md px-3 py-2 border ${theme.input} font-medium`} placeholder="e.g. 2" />
                  </div>
                  <div className="col-span-2">
                    <input required min="1" max="100" type="number" value={rule.pct} onChange={e => updateRule(rule.id, 'pct', e.target.value)} className={`w-full rounded-md px-3 py-2 border ${theme.input} font-medium`} placeholder="e.g. 50" />
                  </div>
                  <div className="flex justify-center">
                    <button type="button" onClick={() => removeRule(rule.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addRule} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:text-blue-800 mb-6">
              <Plus className="w-4 h-4"/> Add Another Rule
            </button>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => setIsDiscountModalOpen(false)} className={`px-4 py-2 border rounded-lg ${theme.textMain} ${theme.hover} ${theme.border}`}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Apply Rules</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const InventoryForm = () => {
    const [formData, setFormData] = useState(editingItem || {
      productId: `PRD-${Math.floor(1000 + Math.random() * 9000)}`, name: '', category: categories[0], 
      quantity: '', unit: 'kg', costPrice: '', price: '', gst: '0', mfgDate: '', expDate: '', barcode: ''
    });
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      let finalCategory = formData.category;
      if (isCustomCategory && customCategory.trim() !== '') {
        finalCategory = customCategory.trim();
        if (!categories.includes(finalCategory)) setCategories([...categories, finalCategory]);
      }
      
      let payload = { ...formData, category: finalCategory, id: editingItem ? editingItem.id : Date.now().toString(), barcode: formData.barcode || generateBarcode() };
      if (editingItem && Number(editingItem.price) !== Number(payload.price)) {
          delete payload.originalPrice; 
      }

      if (editingItem) setInventory(inventory.map(i => i.id === payload.id ? payload : i));
      else setInventory([...inventory, payload]);
      
      setIsInvFormOpen(false); setEditingItem(null);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 no-print">
        <div className={`${theme.bgCard} ${theme.border} border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200`}>
          <h2 className={`text-xl font-bold mb-6 ${theme.textMain}`}>{editingItem ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
              <div><label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Product ID</label><input required type="text" value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} /></div>
              <div><label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Item Name</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Category</label>
                {!isCustomCategory ? (
                  <select value={formData.category} onChange={e => { if(e.target.value === 'ADD_NEW') setIsCustomCategory(true); else setFormData({...formData, category: e.target.value}); }} className={`w-full rounded-md px-3 py-2 border ${theme.input}`}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}<option value="ADD_NEW" className="font-bold text-green-600">+ Add New Category</option>
                  </select>
                ) : (
                  <div className="flex gap-2"><input required autoFocus type="text" placeholder="New Category Name" value={customCategory} onChange={e => setCustomCategory(e.target.value)} className={`flex-1 rounded-md px-3 py-2 border ${theme.input}`} /><button type="button" onClick={() => setIsCustomCategory(false)} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button></div>
                )}
              </div>
              <div>
                 <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Quantity & Unit</label>
                 <div className="flex gap-2">
                    <input required min="0" type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className={`w-2/3 rounded-md px-3 py-2 border ${theme.input}`} />
                    <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className={`w-1/3 rounded-md px-2 py-2 border ${theme.input}`}>{UNITS.map(u => <option key={u} value={u}>{u}</option>)}</select>
                 </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Cost Price (₹)</label><input required min="0" type="number" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} /></div>
              <div><label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Selling Price (₹)</label><input required min="0" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} /></div>
              <div><label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>GST (%)</label><select value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`}>{GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}</select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Mfg Date</label><input required max={today} type="date" value={formData.mfgDate} onChange={e => setFormData({...formData, mfgDate: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} /></div>
              <div><label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Expiry Date</label><input required type="date" value={formData.expDate} onChange={e => setFormData({...formData, expDate: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => { setIsInvFormOpen(false); setEditingItem(null); }} className={`px-4 py-2 border rounded-lg ${theme.textMain} ${theme.hover} ${theme.border}`}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-full mx-auto animate-in fade-in duration-500 print-table-container">
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className={`text-2xl font-bold ${theme.textMain}`}>Inventory Master</h2>
        <div className="flex gap-2">
          <button onClick={() => setIsDiscountModalOpen(true)} className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30 transition-colors`}>
            <Tag className="w-4 h-4" /> Set Discounts
          </button>
          <button onClick={() => window.print()} className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${theme.textMain} ${theme.hover} ${theme.border}`}><Printer className="w-4 h-4" /> Save PDF</button>
          <button onClick={() => setIsInvFormOpen(true)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><Plus className="w-4 h-4" /> Add Item</button>
        </div>
      </div>
      <div className={`${theme.bgCard} rounded-xl shadow-sm border ${theme.border} overflow-hidden`}>
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${theme.tableHeader} text-sm border-b`}>
                {[ { key: 'productId', label: 'ID' }, { key: 'name', label: 'Product Name' }, { key: 'category', label: 'Category' }, { key: 'quantity', label: 'Qty/Unit' }, { key: 'costPrice', label: 'Cost Price (₹)' }, { key: 'price', label: 'Selling Price (₹)' }, { key: 'gst', label: 'GST' }, { key: 'barcode', label: 'Barcode' },  { key: 'expDate', label: 'Expiry' } ].map(col => (
                  <th key={col.key} className="p-2 text-xs font-semibold break-words cursor-pointer hover:opacity-80" onClick={() => handleSort(col.key)}>
                    <div className="flex items-center gap-1">{col.label}{sortConfig.key === col.key && <ArrowUpDown className="w-3 h-3 opacity-50" />}</div>
                  </th>
                ))}
                <th className="p-2 font-semibold text-center no-print">Actions</th>
              </tr>
              <tr className={`${theme.bgSidebar} border-b ${theme.border} no-print`}>
                <td className="p-2"><input type="text" placeholder="Filter ID..." onChange={(e) => handleFilterChange('productId', e.target.value)} value={filters.productId || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                <td className="p-2"><input type="text" placeholder="Filter Name..." onChange={(e) => handleFilterChange('name', e.target.value)} value={filters.name || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                <td className="p-2"><select onChange={(e) => handleFilterChange('category', e.target.value)} value={filters.category || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}><option value="">All</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></td>
                <td className="p-2"><input type="text" placeholder="Filter Qty..." onChange={(e) => handleFilterChange('quantity', e.target.value)} value={filters.quantity || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                <td className="p-2"><input type="text" placeholder="Filter Cost Price..." onChange={(e) => handleFilterChange('costPrice', e.target.value)} value={filters.costPrice || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                <td className="p-2"><input type="text" placeholder="Filter Selling Price..." onChange={(e) => handleFilterChange('price', e.target.value)} value={filters.price || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                <td className="p-2"><input type="text" placeholder="Filter GST..." onChange={(e) => handleFilterChange('gst', e.target.value)} value={filters.gst || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                <td className="p-2"><input type="text" placeholder="Filter Barcode..." onChange={(e) => handleFilterChange('barcode', e.target.value)} value={filters.barcode || ''} className={`w-full p-1 text-xs rounded border ${theme.input}`}/></td>
                <td className="p-2"></td>
                <td className="p-2 text-center"><button onClick={clearFilters} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"><FilterX className="w-4 h-4"/></button></td>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {processedInventory.map((item) => (
                <tr key={item.id} className={theme.tableRow}>
                  <td className={`p-3 text-sm font-medium ${theme.textMain}`}>{item.productId}</td>
                  <td className={`p-3 text-sm font-medium ${theme.textMain}`}>{item.name}</td>
                  <td className="p-2"><span className={`inline-block px-2 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded text-xs`}>{item.category}</span></td>
                  <td className={`p-3 text-sm font-bold ${theme.textMain}`}>{item.quantity} <span className="font-normal text-xs">{item.unit}</span></td>
                  <td className={`p-3 text-sm text-red-500`}>₹{item.costPrice || 0}</td>
                  
                  <td className={`p-3 text-sm text-green-600 font-bold whitespace-nowrap`}>
                    {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                      <span className="line-through text-gray-400 font-normal text-xs mr-2">
                        ₹{item.originalPrice}
                      </span>
                    )}
                    ₹{item.price}
                  </td>
                  
                  <td className={`p-3 text-sm ${theme.textMain}`}>{item.gst}%</td>
                  <td className="p-2 text-center"><span className={`font-['Libre_Barcode_39'] text-xl leading-none block ${theme.textMain}`} title={item.barcode}>*{item.barcode}*</span></td>
                  <td className="p-2 text-sm">{getDaysToExpiry(item.expDate) < 0 ? <span className="text-red-500 font-bold">Expired</span> : <span className={theme.textMain}>{item.expDate}</span>}</td>
                  <td className="p-2 no-print flex gap-2 justify-center">
                    <button onClick={() => {setEditingItem(item); setIsInvFormOpen(true);}} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => { if(window.confirm('Delete item?')) setInventory(inventory.filter(i => i.id !== item.id)); }} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isInvFormOpen && <InventoryForm />}
      {isDiscountModalOpen && <DiscountModal />}
    </div>
  );
};

export default Inventory;
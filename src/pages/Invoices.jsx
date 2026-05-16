import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, FileText, Settings, Users, 
  Plus, Edit, Trash2, AlertTriangle, Download,
  RotateCcw, ArrowUpDown, X, Printer, Moon, Sun, FilterX, PlusCircle
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { DEFAULT_CATEGORIES, DUMMY_DATA, DUMMY_SUPPLIERS, getTheme, today } from '../utils/constants';

const Invoices = ({ invoices, setInvoices, inventory, setInventory, suppliers, theme, isDarkMode }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sub-component for creating an invoice
  const InvoiceForm = () => {
    const [formData, setFormData] = useState({
      invoiceId: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'PURCHASE',
      supplierId: suppliers.length > 0 ? suppliers[0].supplierId : '',
      date: today,
      status: 'PAID'
    });
    
    // Dynamic array for multiple line items
    const [lineItems, setLineItems] = useState([{ productId: '', qty: 1, cost: 0 }]);

    const addLineItem = () => setLineItems([...lineItems, { productId: '', qty: 1, cost: 0 }]);
    const removeLineItem = (index) => setLineItems(lineItems.filter((_, i) => i !== index));

    const handleLineItemChange = (index, field, value) => {
      const newItems = [...lineItems];
      newItems[index][field] = value;
      // Auto-fill cost if product is selected
      if (field === 'productId') {
        const product = inventory.find(p => p.productId === value);
        if (product) newItems[index].cost = product.costPrice || 0;
      }
      setLineItems(newItems);
    };

    const totalAmount = lineItems.reduce((sum, item) => sum + (Number(item.qty) * Number(item.cost)), 0);

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // 1. Validate
      if (lineItems.some(item => !item.productId)) return alert("Please select a product for all rows.");

      // 2. Save the Invoice
      const newInvoice = { ...formData, items: lineItems, totalAmount, id: Date.now().toString() };
      setInvoices([...invoices, newInvoice]);

      // 3. AUTOMATION: Update the Inventory Stock & Costs!
      const updatedInventory = [...inventory];
      lineItems.forEach(lineItem => {
         const productIndex = updatedInventory.findIndex(p => p.productId === lineItem.productId);
         if (productIndex !== -1) {
            updatedInventory[productIndex] = {
               ...updatedInventory[productIndex],
               quantity: Number(updatedInventory[productIndex].quantity) + Number(lineItem.qty), // ADD STOCK
               costPrice: Number(lineItem.cost) // Update to latest cost paid
            };
         }
      });
      setInventory(updatedInventory);

      setIsFormOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`${theme.bgCard} ${theme.border} border rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
          <h2 className={`text-xl font-bold mb-6 ${theme.textMain}`}>Create Purchase Invoice</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Supplier</label>
                <select required value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`}>
                  <option value="" disabled>Select Supplier</option>
                  {suppliers.map(s => <option key={s.supplierId} value={s.supplierId}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Date</label>
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Payment Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className={`w-full rounded-md px-3 py-2 border ${theme.input}`}>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending (Debt)</option>
                </select>
              </div>
            </div>

            {/* LINE ITEMS SECTION */}
            <div className={`border ${theme.border} rounded-lg p-4`}>
              <h3 className={`text-md font-semibold mb-3 ${theme.textMain}`}>Purchased Items</h3>
              {lineItems.map((item, index) => (
                <div key={index} className="flex gap-3 mb-3 items-end">
                  <div className="flex-1">
                    <label className={`block text-xs font-medium ${theme.textMuted} mb-1`}>Product</label>
                    <select required value={item.productId} onChange={e => handleLineItemChange(index, 'productId', e.target.value)} className={`w-full rounded-md px-2 py-1.5 border ${theme.input}`}>
                      <option value="">Select Item...</option>
                      {inventory.map(p => <option key={p.productId} value={p.productId}>{p.name} ({p.unit})</option>)}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className={`block text-xs font-medium ${theme.textMuted} mb-1`}>Qty Bought</label>
                    <input required type="number" min="1" value={item.qty} onChange={e => handleLineItemChange(index, 'qty', e.target.value)} className={`w-full rounded-md px-2 py-1.5 border ${theme.input}`} />
                  </div>
                  <div className="w-32">
                    <label className={`block text-xs font-medium ${theme.textMuted} mb-1`}>Cost per Unit (₹)</label>
                    <input required type="number" min="0" value={item.cost} onChange={e => handleLineItemChange(index, 'cost', e.target.value)} className={`w-full rounded-md px-2 py-1.5 border ${theme.input}`} />
                  </div>
                  <div className="w-24 pb-2 text-right font-medium text-sm">
                     ₹{item.qty * item.cost}
                  </div>
                  <button type="button" onClick={() => removeLineItem(index)} className="pb-2 text-red-500 hover:text-red-700 disabled:opacity-50" disabled={lineItems.length === 1}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addLineItem} className="mt-2 text-sm text-blue-600 flex items-center gap-1 hover:underline"><PlusCircle className="w-4 h-4"/> Add Another Item</button>
            </div>

            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className={`font-semibold ${theme.textMain}`}>Total Invoice Amount:</span>
              <span className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsFormOpen(false)} className={`px-4 py-2 border rounded-lg ${theme.textMain}`}>Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save & Update Stock</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme.textMain}`}>Purchase Invoices</h2>
          <p className={`text-sm ${theme.textMuted}`}>Process incoming stock and track supplier payments.</p>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" /> Process New Invoice</button>
      </div>

      <div className={`${theme.bgCard} rounded-xl shadow-sm border ${theme.border} overflow-hidden`}>
        <table className="w-full text-left">
          <thead>
            <tr className={`${theme.tableHeader} text-sm border-b`}>
              <th className="p-4 font-semibold">Invoice No.</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Supplier</th>
              <th className="p-4 font-semibold">Items Bought</th>
              <th className="p-4 font-semibold">Total Amount</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {invoices.length === 0 ? (
               <tr><td colSpan="6" className={`p-8 text-center ${theme.textMuted}`}>No invoices processed yet.</td></tr>
            ) : invoices.map(inv => {
              const supplier = suppliers.find(s => s.supplierId === inv.supplierId);
              return (
                <tr key={inv.id} className={theme.tableRow}>
                  <td className={`p-4 font-medium ${theme.textMain}`}>{inv.invoiceId}</td>
                  <td className={`p-4 ${theme.textMain}`}>{inv.date}</td>
                  <td className={`p-4 font-medium ${theme.textMain}`}>{supplier ? supplier.name : 'Unknown'}</td>
                  <td className={`p-4 ${theme.textMain}`}>{inv.items.length} unique products</td>
                  <td className={`p-4 font-bold ${theme.textMain}`}>₹{inv.totalAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {isFormOpen && <InvoiceForm />}
    </div>
  );
};

export default Invoices;
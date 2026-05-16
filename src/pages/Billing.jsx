import React, { useState } from 'react';
import { 
  ShoppingCart, Trash2, History, Receipt, Download, PlusCircle, User, Search
} from 'lucide-react';
import { today, getDaysToExpiry, STORE_DETAILS } from '../utils/constants';

const Billing = ({ 
  sales = [], 
  setSales, 
  inventory = [], 
  setInventory, 
  customers = [], 
  setCustomers, 
  theme = { bgCard: 'bg-white', textMain: 'text-gray-800', border: 'border-gray-200', textMuted: 'text-gray-500', input: 'border-gray-300', tableHeader: 'bg-gray-50', tableRow: 'hover:bg-gray-50', hover: 'hover:bg-gray-100' }, 
  isDarkMode = false 
}) => {
  const [activeTab, setActiveTab] = useState('POS'); 
  
  // Cart & POS State
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  
  // Coinz Program State
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [useCoinz, setUseCoinz] = useState(false);

  // --- SMART SEARCH FILTERING ---
  const validInventory = inventory.filter(p => {
    const hasStock = Number(p.quantity) > 0;
    const isNotExpired = p.expDate ? getDaysToExpiry(p.expDate) >= 0 : true;
    return hasStock && isNotExpired;
  });
  
  const searchResults = searchTerm.trim() === '' ? [] : validInventory.filter(p => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name ? p.name.toLowerCase().includes(term) : false;
    const idMatch = p.productId ? p.productId.toLowerCase().includes(term) : false;
    const barcodeMatch = p.barcode ? p.barcode.toLowerCase().includes(term) : false;
    return nameMatch || idMatch || barcodeMatch;
  }).slice(0, 8); 

  const handlePhoneChange = (e) => {
    const phone = e.target.value.replace(/[^0-9]/g, '');
    setCustomerPhone(phone);
    const existingCustomer = customers.find(c => c.phone === phone);
    if (existingCustomer) {
      setCustomerName(existingCustomer.name);
    } else if (phone.length < 10) {
      setCustomerName(''); 
      setUseCoinz(false);
    }
  };

  const addToCart = (productIdToAdd) => {
    if (!productIdToAdd) return;
    const product = inventory.find(p => p.productId === productIdToAdd);
    if (!product) return;
    if (Number(product.quantity) <= 0) return alert("Out of stock!");

    const existingItem = cart.find(item => item.productId === product.productId);
    
    if (existingItem) {
      if (existingItem.qty >= Number(product.quantity)) return alert("Cannot add more than available stock!");
      setCart(cart.map(item => item.productId === product.productId ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { 
        productId: product.productId, name: product.name, price: product.price, 
        // Track the original price to calculate savings later!
        originalPrice: product.originalPrice || product.price, 
        costPrice: product.costPrice || 0, qty: 1, unit: product.unit, gst: product.gst 
      }]);
    }
    setSearchTerm(''); 
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) addToCart(searchResults[0].productId);
  };

  const removeFromCart = (productId) => setCart(cart.filter(item => item.productId !== productId));
  
  const updateCartQty = (productId, newQty) => {
    if (newQty < 1) return;
    const product = inventory.find(p => p.productId === productId);
    if (newQty > Number(product.quantity)) return alert("Cannot exceed available stock!");
    setCart(cart.map(item => item.productId === productId ? { ...item, qty: newQty } : item));
  };

  // --- CALCULATION LOGIC ---
  const currentCustomer = customers.find(c => c.phone === customerPhone);
  const availableCoinz = currentCustomer ? currentCustomer.coinzBalance : 0;
  
  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
  
  // Calculate Savings from Expiry Rules
  const itemDiscounts = cart.reduce((sum, item) => sum + ((Number(item.originalPrice) - Number(item.price)) * Number(item.qty)), 0);
  
  const coinzDiscount = useCoinz ? Math.min(availableCoinz, cartTotal) : 0;
  const finalTotalAmount = cartTotal - coinzDiscount;
  const earnedCoinz = Math.floor(finalTotalAmount / 2000) * 10;
  
  // Total of EVERYTHING saved by the customer (Item Discounts + Coinz)
  const totalSavings = itemDiscounts + coinzDiscount;

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (customerPhone && customerPhone.length !== 10) return alert("Please enter a valid 10-digit phone number, or leave it blank.");

    if (customerPhone) {
      const existingIndex = customers.findIndex(c => c.phone === customerPhone);
      if (existingIndex >= 0) {
        const updatedLedger = [...customers];
        updatedLedger[existingIndex].coinzBalance = updatedLedger[existingIndex].coinzBalance - coinzDiscount + earnedCoinz;
        setCustomers(updatedLedger);
      } else {
        setCustomers([...customers, {
          phone: customerPhone, name: customerName || 'Guest', coinzBalance: earnedCoinz, joinedDate: today
        }]);
      }
    }

    const newBill = {
      billId: `BILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: today,
      items: cart,
      subTotal: cartTotal + itemDiscounts, // Pre-discount total
      itemDiscounts: itemDiscounts, // Saved via expiry rules
      coinzApplied: coinzDiscount,  // Saved via Coinz
      totalSavings: totalSavings,   // Grand Total Saved
      totalAmount: finalTotalAmount, 
      paymentMethod: paymentMethod,
      customerPhone: customerPhone || 'N/A',
      customerName: customerPhone ? (customerName || 'Guest') : 'N/A',
      earnedCoinz: customerPhone ? earnedCoinz : 0,
      id: Date.now().toString()
    };

    setSales([...sales, newBill]);

    const updatedInventory = [...inventory];
    cart.forEach(cartItem => {
      const productIndex = updatedInventory.findIndex(p => p.productId === cartItem.productId);
      if (productIndex !== -1) {
        updatedInventory[productIndex] = {
          ...updatedInventory[productIndex], quantity: Number(updatedInventory[productIndex].quantity) - Number(cartItem.qty)
        };
      }
    });
    setInventory(updatedInventory);

    setCart([]);
    setCustomerPhone('');
    setCustomerName('');
    setUseCoinz(false);
    alert(`Sale completed! Bill No: ${newBill.billId} ${customerPhone ? `\nEarned ${earnedCoinz} Coinz!` : ''}`);
  };

  const exportSalesToCSV = () => {
    const headers = "Bill No.,Date,Payment Method,Customer Name,Customer Phone,Item Discounts,Coinz Applied,Total Savings,Earned Coinz,Item Name,Qty,Unit,Rate(₹),Item Total(₹),Bill Total(₹)";
    const rows = [];
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const safeName = `"${item.name || ''}"`;
        const itemTotal = Number(item.qty) * Number(item.price);
        rows.push(`${sale.billId},${sale.date},${sale.paymentMethod},${sale.customerName},${sale.customerPhone},${sale.itemDiscounts || 0},${sale.coinzApplied || 0},${sale.totalSavings || 0},${sale.earnedCoinz},${safeName},${item.qty},${item.unit},${item.price},${itemTotal},${sale.totalAmount}`);
      });
    });
    const csvContent = "\uFEFF" + headers + "\n" + rows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sales_ledger_itemized.csv";
    link.click();
  };

  const [selectedBill, setSelectedBill] = useState(null);

  return (
    <>
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500 print:hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme.textMain}`}>Point of Sale (POS)</h2>
            <p className={`text-sm ${theme.textMuted}`}>Process sales, deduct stock, and track Coinz rewards.</p>
          </div>
          <div className="flex bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
            <button onClick={() => setActiveTab('POS')} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'POS' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : theme.textMuted}`}><ShoppingCart className="w-4 h-4" /> New Sale</button>
            <button onClick={() => setActiveTab('HISTORY')} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'HISTORY' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : theme.textMuted}`}><History className="w-4 h-4" /> Sales History</button>
          </div>
        </div>

        {activeTab === 'POS' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 ${theme.bgCard} rounded-xl shadow-sm border ${theme.border} p-6 flex flex-col`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme.textMain}`}><PlusCircle className="w-5 h-5 text-blue-500"/> Search & Add Items</h3>
              
              <div className="flex gap-3 mb-6 relative">
                <div className="relative flex-1">
                  <div className={`flex items-center rounded-lg border ${theme.input} overflow-hidden focus-within:ring-2 focus-within:ring-blue-500`}>
                    <Search className={`w-5 h-5 ml-3 ${theme.textMuted}`} />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Search Name, ID, or scan Barcode..."
                      className="w-full px-3 py-3 bg-transparent outline-none text-lg"
                    />
                  </div>

                  {searchTerm && (
                    <ul className={`absolute z-20 w-full mt-2 max-h-60 overflow-y-auto rounded-lg shadow-xl border ${theme.border} ${theme.bgCard}`}>
                      {searchResults.length > 0 ? (
                        searchResults.map(p => (
                          <li 
                            key={p.productId} 
                            onClick={() => addToCart(p.productId)}
                            className={`px-4 py-3 cursor-pointer border-b last:border-0 ${theme.border} ${theme.hover} flex justify-between items-center transition-colors`}
                          >
                            <div>
                              <div className={`font-bold ${theme.textMain}`}>{p.name}</div>
                              <div className={`text-xs ${theme.textMuted}`}>ID: {p.productId} {p.barcode ? `| Barcode: ${p.barcode}` : ''}</div>
                            </div>
                            <div className="text-right">
                              {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                                <div className="text-xs text-gray-400 line-through">₹{p.originalPrice}</div>
                              )}
                              <div className="font-bold text-green-600">₹{p.price}</div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className={`px-4 py-4 text-center ${theme.textMuted}`}>No matching products found.</li>
                      )}
                    </ul>
                  )}
                </div>
                
                <button 
                  onClick={() => searchResults.length > 0 && addToCart(searchResults[0].productId)} 
                  disabled={searchResults.length === 0} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg flex-1">
                <table className="w-full text-left table-fixed">
                  <thead className={`${theme.tableHeader} text-sm border-b`}>
                    <tr>
                      <th className="p-3 font-semibold w-[40%]">Product</th>
                      <th className="p-3 font-semibold w-[20%] text-center">Qty</th>
                      <th className="p-3 font-semibold w-[20%] text-right">Price</th>
                      <th className="p-3 font-semibold w-[20%] text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {cart.length === 0 ? (
                      <tr><td colSpan="4" className={`p-8 text-center ${theme.textMuted}`}>Cart is empty. Search products to begin billing.</td></tr>
                    ) : cart.map((item) => (
                      <tr key={item.productId} className={theme.tableRow}>
                        <td className={`p-3 font-medium ${theme.textMain}`}>{item.name}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => updateCartQty(item.productId, item.qty - 1)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">-</button>
                            <span className={`w-16 text-center font-bold ${theme.textMain}`}>{item.qty} <span className="text-xs font-normal opacity-70">{item.unit}</span></span>
                            <button onClick={() => updateCartQty(item.productId, item.qty + 1)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">+</button>
                          </div>
                        </td>
                        <td className={`p-3 text-right font-bold ${theme.textMain}`}>
                          {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                            <span className="line-through text-gray-400 font-normal text-xs mr-2">
                              ₹{(item.originalPrice * item.qty).toLocaleString()}
                            </span>
                          )}
                          ₹{(item.price * item.qty).toLocaleString()}
                        </td>
                        <td className="p-3 text-center"><button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg"><Trash2 className="w-5 h-5 mx-auto" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`${theme.bgCard} rounded-xl shadow-sm border ${theme.border} flex flex-col`}>
              <div className="p-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${theme.textMain}`}><User className="w-5 h-5 text-purple-500"/> Customer Details</h3>
                <div className="mt-4">
                  <input type="text" maxLength={10} placeholder="Phone Number (Optional)" value={customerPhone} onChange={handlePhoneChange} className={`w-full rounded-md px-3 py-2 border ${theme.input} font-medium tracking-wider mb-2`} />
                  
                  {customerPhone.length === 10 && (
                    <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={`w-full rounded-md px-3 py-2 border ${theme.input} font-medium mb-2`} />
                  )}

                  {currentCustomer && (
                    <div className="mt-2 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="font-bold text-yellow-600 mb-1">🪙 {availableCoinz} Coinz Available</div>
                      {availableCoinz > 0 && cartTotal > 0 && (
                        <label className={`flex items-center gap-2 cursor-pointer ${theme.textMain}`}>
                          <input type="checkbox" checked={useCoinz} onChange={(e) => setUseCoinz(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                          <span>Redeem Coinz (-₹{Math.min(availableCoinz, cartTotal)})</span>
                        </label>
                      )}
                    </div>
                  )}

                  {customerPhone && finalTotalAmount >= 2000 && (
                    <div className="mt-3 text-sm font-bold text-green-700 bg-green-50 dark:bg-green-900/30 p-2 rounded border border-green-200 dark:border-green-800 text-center">
                      Will Earn {earnedCoinz} Coinz!
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col h-full">
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme.textMain}`}><Receipt className="w-5 h-5 text-green-500"/> Order Summary</h3>
                
                <div className={`flex justify-between items-center py-2 ${theme.textMuted}`}>
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.qty, 0)} Items):</span>
                  <span className={`font-bold ${theme.textMain}`}>₹{(cartTotal + itemDiscounts).toLocaleString()}</span>
                </div>

                {itemDiscounts > 0 && (
                  <div className={`flex justify-between items-center py-2 text-green-600 font-bold`}>
                    <span>Product Discounts:</span>
                    <span>-₹{itemDiscounts.toLocaleString()}</span>
                  </div>
                )}

                {coinzDiscount > 0 && (
                  <div className={`flex justify-between items-center py-2 text-yellow-600 font-bold`}>
                    <span>Coinz Applied:</span>
                    <span>-₹{coinzDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className={`flex justify-between items-center py-4 border-b ${theme.border}`}>
                  <span className={theme.textMuted}>Payment Method:</span>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={`rounded-md px-3 py-1.5 border ${theme.input} font-medium`}>
                    <option value="CASH">💵 Cash</option>
                    <option value="UPI">📱 UPI / QR</option>
                    <option value="CARD">💳 Card</option>
                  </select>
                </div>
                <div className="mt-auto pt-6">
                  <div className="flex justify-between items-end mb-6">
                    <span className={`text-xl font-bold ${theme.textMain}`}>Grand Total:</span>
                    <span className="text-4xl font-black text-green-600">₹{finalTotalAmount.toLocaleString()}</span>
                  </div>
                  <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-xl text-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95">Complete Sale</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`${theme.bgCard} rounded-xl shadow-sm border ${theme.border} overflow-hidden`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className={`font-bold ${theme.textMain}`}>Recent Bills</h3>
              <button onClick={exportSalesToCSV} disabled={sales.length === 0} className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg text-sm ${theme.border} ${theme.textMain} ${theme.hover} disabled:opacity-50`}><Download className="w-4 h-4" /> Export Ledger</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className={`${theme.tableHeader} text-sm border-b`}>
                  <th className="p-4 font-semibold">Bill No.</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Method</th>
                  <th className="p-4 font-semibold text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {sales.length === 0 ? (
                  <tr><td colSpan="5" className={`p-8 text-center ${theme.textMuted}`}>No sales recorded yet.</td></tr>
                ) : sales.slice().reverse().map(sale => (
                  <tr key={sale.id} className={theme.tableRow}>
                    <td className="p-4 font-medium"><button onClick={() => setSelectedBill(sale)} className="text-blue-600 hover:text-blue-800 hover:underline transition-all">{sale.billId}</button></td>
                    <td className={`p-4 ${theme.textMain}`}>{sale.date}</td>
                    <td className={`p-4 ${theme.textMuted}`}>{sale.customerName !== 'N/A' ? sale.customerName : 'Guest'}</td>
                    <td className={`p-4 font-medium ${theme.textMain}`}><span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">{sale.paymentMethod}</span></td>
                    <td className={`p-4 text-right font-bold text-green-600`}>₹{sale.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RECEIPT MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 print:absolute print:inset-0 print:bg-white print:p-0">
          <div className={`${theme.bgCard} border ${theme.border} rounded-xl w-full max-w-md flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-w-none print:w-full print:max-h-none print:overflow-visible`}>
            
            <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible">
              <div className="text-center mb-6 border-b-2 border-dashed border-gray-300 dark:border-gray-600 pb-6">
                <h2 className={`text-xl font-black uppercase tracking-wider mb-2 ${theme.textMain}`}>{STORE_DETAILS.name}</h2>
                <p className={`text-sm ${theme.textMuted}`}>{STORE_DETAILS.address}</p>
                <p className={`text-sm ${theme.textMuted}`}>Phone: {STORE_DETAILS.phone}</p>
                <p className={`text-sm ${theme.textMuted}`}>Contact: {STORE_DETAILS.contactPerson}</p>
                <p className={`text-md font-semibold mt-4 ${theme.textMain}`}>*** TAX INVOICE ***</p>
              </div>

              <div className={`flex justify-between text-sm mb-4 ${theme.textMain}`}>
                <div>
                  <span className="opacity-70">Bill No:</span> <b>{selectedBill.billId}</b><br/>
                  <span className="opacity-70">Date:</span> <b>{selectedBill.date}</b>
                </div>
                <div className="text-right">
                  <span className="opacity-70">Customer:</span> <b>{selectedBill.customerName}</b><br/>
                  {selectedBill.customerPhone !== 'N/A' && <><span className="opacity-70">Ph:</span> <b>{selectedBill.customerPhone}</b></>}
                </div>
              </div>

              <table className={`w-full text-sm mb-4 ${theme.textMain}`}>
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Rate</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {selectedBill.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 pr-2">{item.name}</td>
                      <td className="py-2 text-center">{item.qty} <span className="text-[10px] opacity-70">{item.unit}</span></td>
                      <td className="py-2 text-right">₹{item.price}</td>
                      <td className="py-2 text-right font-medium">₹{(item.qty * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-4 mb-6">
                
                <div className={`flex justify-between items-center text-sm ${theme.textMain} mb-1`}>
                  <span>Subtotal:</span>
                  <span>₹{selectedBill.subTotal ? selectedBill.subTotal.toLocaleString() : selectedBill.totalAmount.toLocaleString()}</span>
                </div>

                {selectedBill.itemDiscounts > 0 && (
                  <div className={`flex justify-between items-center text-sm text-green-600 font-bold mb-1`}>
                    <span>Product Discounts:</span>
                    <span>- ₹{selectedBill.itemDiscounts.toLocaleString()}</span>
                  </div>
                )}
                
                {selectedBill.coinzApplied > 0 && (
                  <div className={`flex justify-between items-center text-sm text-yellow-600 font-bold mb-2`}>
                    <span>Coinz Applied:</span>
                    <span>- ₹{selectedBill.coinzApplied.toLocaleString()}</span>
                  </div>
                )}

                <div className={`flex justify-between items-center text-lg font-black ${theme.textMain} mt-2`}>
                  <span>Grand Total:</span>
                  <span>₹{selectedBill.totalAmount.toLocaleString()}</span>
                </div>
                
                <div className={`text-right text-xs mt-1 ${theme.textMuted}`}>
                  (Includes GST where applicable)
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className={`text-sm font-medium ${theme.textMain}`}>
                  Paid via {selectedBill.paymentMethod === 'CASH' ? '💵 Cash' : selectedBill.paymentMethod === 'UPI' ? '📱 UPI' : '💳 Card'}
                </p>
                
                {/* FOOTER MESSAGES: Savings and Coinz */}
                {selectedBill.totalSavings > 0 && (
                  <div className="mt-3 p-3 border-2 border-dashed border-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg mx-auto max-w-[80%]">
                     <p className="text-sm font-black text-green-700 dark:text-green-400 uppercase tracking-wide">
                       You Saved ₹{selectedBill.totalSavings.toLocaleString()} !!!
                     </p>
                     <p className="text-xs text-green-600 dark:text-green-500 font-medium mt-1">
                       Continue shopping with us!!
                     </p>
                  </div>
                )}

                {selectedBill.earnedCoinz > 0 && (
                  <p className="text-sm font-bold text-yellow-600 border border-yellow-200 bg-yellow-50 py-1 px-3 rounded inline-block mt-3">
                    🪙 Earned {selectedBill.earnedCoinz} Coinz on this visit!
                  </p>
                )}
              </div>
            </div>

            <div className={`p-4 bg-gray-50 dark:bg-gray-800 border-t ${theme.border} flex justify-end gap-3 rounded-b-xl print:hidden`}>
              <button onClick={() => window.print()} className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${theme.textMain} ${theme.hover} ${theme.border}`}><Receipt className="w-4 h-4" /> Print</button>
              <button onClick={() => setSelectedBill(null)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Billing;
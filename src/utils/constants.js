export const DEFAULT_CATEGORIES = ['Grains', 'Dairy', 'Fruits', 'Vegetables', 'Bakery', 'Beverages'];
export const UNITS = ['kg', 'g', 'L', 'ml', 'packet', 'box', 'piece', 'dozen'];
export const GST_RATES = ['0', '5', '12', '18', '28'];
export const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

export const generateBarcode = () => Math.floor(100000000000 + Math.random() * 900000000000).toString();
export const getDaysToExpiry = (expDate) => Math.ceil((new Date(expDate) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
export const today = new Date().toISOString().split('T')[0];

export const DUMMY_DATA = [
  // Expired Products
  {
    id: '1',
    productId: 'PRD-1001',
    name: 'Basmati Rice',
    category: 'Grains',
    quantity: 20,
    unit: 'kg',
    costPrice: 380,
    price: 450,
    gst: '5',
    mfgDate: '2025-01-10',
    expDate: '2026-03-15',
    barcode: generateBarcode()
  },
  {
    id: '2',
    productId: 'PRD-1002',
    name: 'Whole Milk',
    category: 'Dairy',
    quantity: 15,
    unit: 'L',
    costPrice: 48,
    price: 60,
    gst: '0',
    mfgDate: '2026-04-01',
    expDate: '2026-05-01',
    barcode: generateBarcode()
  },
  {
    id: '3',
    productId: 'PRD-1003',
    name: 'Apples',
    category: 'Fruits',
    quantity: 30,
    unit: 'kg',
    costPrice: 95,
    price: 120,
    gst: '0',
    mfgDate: '2026-04-10',
    expDate: '2026-05-05',
    barcode: generateBarcode()
  },
  {
    id: '4',
    productId: 'PRD-1004',
    name: 'Brown Bread',
    category: 'Bakery',
    quantity: 25,
    unit: 'pcs',
    costPrice: 32,
    price: 45,
    gst: '5',
    mfgDate: '2026-04-15',
    expDate: '2026-05-10',
    barcode: generateBarcode()
  },
  {
    id: '5',
    productId: 'PRD-1005',
    name: 'Curd',
    category: 'Dairy',
    quantity: 18,
    unit: 'cups',
    costPrice: 24,
    price: 35,
    gst: '0',
    mfgDate: '2026-04-20',
    expDate: '2026-05-12',
    barcode: generateBarcode()
  },

  // Expiring within next 20 days
  {
    id: '6',
    productId: 'PRD-1006',
    name: 'Tomato Ketchup',
    category: 'Condiments',
    quantity: 12,
    unit: 'bottles',
    costPrice: 82,
    price: 110,
    gst: '12',
    mfgDate: '2025-12-01',
    expDate: '2026-05-20',
    barcode: generateBarcode()
  },
  {
    id: '7',
    productId: 'PRD-1007',
    name: 'Paneer',
    category: 'Dairy',
    quantity: 10,
    unit: 'packs',
    costPrice: 68,
    price: 90,
    gst: '5',
    mfgDate: '2026-05-01',
    expDate: '2026-05-25',
    barcode: generateBarcode()
  },
  {
    id: '8',
    productId: 'PRD-1008',
    name: 'Bananas',
    category: 'Fruits',
    quantity: 40,
    unit: 'dozen',
    costPrice: 50,
    price: 70,
    gst: '0',
    mfgDate: '2026-05-05',
    expDate: '2026-05-30',
    barcode: generateBarcode()
  },
  {
    id: '9',
    productId: 'PRD-1009',
    name: 'Butter',
    category: 'Dairy',
    quantity: 14,
    unit: 'packs',
    costPrice: 40,
    price: 55,
    gst: '5',
    mfgDate: '2026-03-15',
    expDate: '2026-06-01',
    barcode: generateBarcode()
  },
  {
    id: '10',
    productId: 'PRD-1010',
    name: 'Orange Juice',
    category: 'Beverages',
    quantity: 22,
    unit: 'L',
    costPrice: 105,
    price: 140,
    gst: '12',
    mfgDate: '2026-04-01',
    expDate: '2026-06-04',
    barcode: generateBarcode()
  },

  // Expiring after 30+ days
  {
    id: '11',
    productId: 'PRD-1011',
    name: 'Olive Oil',
    category: 'Cooking Essentials',
    quantity: 6,
    unit: 'bottles',
    costPrice: 520,
    price: 650,
    gst: '12',
    mfgDate: '2026-01-01',
    expDate: '2026-08-15',
    barcode: generateBarcode()
  },
  {
    id: '12',
    productId: 'PRD-1012',
    name: 'Green Tea',
    category: 'Beverages',
    quantity: 28,
    unit: 'boxes',
    costPrice: 170,
    price: 220,
    gst: '5',
    mfgDate: '2026-02-10',
    expDate: '2026-09-01',
    barcode: generateBarcode()
  },
  {
    id: '13',
    productId: 'PRD-1013',
    name: 'Frozen Peas',
    category: 'Frozen Foods',
    quantity: 3,
    unit: 'packs',
    costPrice: 10,
    price: 15,
    gst: '5',
    mfgDate: '2026-03-01',
    expDate: '2026-10-10',
    barcode: generateBarcode()
  },
  {
    id: '14',
    productId: 'PRD-1014',
    name: 'Corn Flakes',
    category: 'Breakfast',
    quantity: 19,
    unit: 'boxes',
    costPrice: 145,
    price: 180,
    gst: '12',
    mfgDate: '2026-01-20',
    expDate: '2026-11-05',
    barcode: generateBarcode()
  },
  {
    id: '15',
    productId: 'PRD-1015',
    name: 'Almonds',
    category: 'Dry Fruits',
    quantity: 25,
    unit: 'kg',
    costPrice: 820,
    price: 950,
    gst: '5',
    mfgDate: '2026-02-15',
    expDate: '2027-01-01',
    barcode: generateBarcode()
  }
];

export const DUMMY_SUPPLIERS = [
  {
    id: '1',
    supplierId: 'SUP-001',
    name: 'Dairy Farms Inc.',
    contactPerson: 'Paramesh',
    email: 'orders@dairyfarms.com',
    mobile: '9876543210',
    gstNumber: '29ABFDT7821K1Z3'
  },
  {
    id: '2',
    supplierId: 'SUP-002',
    name: 'Fresh Harvest Traders',
    contactPerson: 'Ramesh Kumar',
    email: 'sales@freshharvest.com',
    mobile: '9123456780',
    gstNumber: '33FGHPL9045M2Z7'
  },
  {
    id: '3',
    supplierId: 'SUP-003',
    name: 'Daily Needs Wholesale',
    contactPerson: 'Priya Sharma',
    email: 'support@dailyneeds.com',
    mobile: '9988776655',
    gstNumber: '27JKLNR5632Q1Z5'
  },
  {
    id: '4',
    supplierId: 'SUP-004',
    name: 'Golden Grains Market',
    contactPerson: 'Suresh Babu',
    email: 'contact@goldengrains.com',
    mobile: '9090909090',
    gstNumber: '24MNOPX1188R1Z9'
  },
  {
    id: '5',
    supplierId: 'SUP-005',
    name: 'Healthy Dry Fruits Co.',
    contactPerson: 'Anita Verma',
    email: 'sales@healthydryfruits.com',
    mobile: '9345678912',
    gstNumber: '36QRSTY4477L2Z1'
  }
];

export const DUMMY_INVOICES = [
  {
    id: '1',
    invoiceId: 'INV-2026-001',
    type: 'PURCHASE',
    supplierId: 'SUP-001',
    date: '2026-05-16',
    items: [
      { productId: 'PRD-1002', qty: 10, cost: 48 },
      { productId: 'PRD-1005', qty: 15, cost: 24 }
    ],
    totalAmount: 840,
    status: 'PAID'
  },
  {
    id: '2',
    invoiceId: 'INV-2026-002',
    type: 'PURCHASE',
    supplierId: 'SUP-002',
    date: '2026-05-17',
    items: [
      { productId: 'PRD-1003', qty: 20, cost: 95 },
      { productId: 'PRD-1008', qty: 25, cost: 50 }
    ],
    totalAmount: 3150,
    status: 'PAID'
  },
  {
    id: '3',
    invoiceId: 'INV-2026-003',
    type: 'PURCHASE',
    supplierId: 'SUP-003',
    date: '2026-05-18',
    items: [
      { productId: 'PRD-1006', qty: 12, cost: 82 },
      { productId: 'PRD-1010', qty: 18, cost: 105 }
    ],
    totalAmount: 2874,
    status: 'PENDING'
  },
  {
    id: '4',
    invoiceId: 'INV-2026-004',
    type: 'PURCHASE',
    supplierId: 'SUP-004',
    date: '2026-05-19',
    items: [
      { productId: 'PRD-1001', qty: 30, cost: 380 },
      { productId: 'PRD-1014', qty: 10, cost: 145 }
    ],
    totalAmount: 12850,
    status: 'PAID'
  },
  {
    id: '5',
    invoiceId: 'INV-2026-005',
    type: 'PURCHASE',
    supplierId: 'SUP-005',
    date: '2026-05-20',
    items: [
      { productId: 'PRD-1015', qty: 8, cost: 820 },
      { productId: 'PRD-1012', qty: 12, cost: 170 }
    ],
    totalAmount: 8600,
    status: 'PAID'
  }
];



export const getTheme = (isDarkMode) => ({
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
});
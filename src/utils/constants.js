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
    gstNumber: '22AAAAA0000A1Z5'
  },
  {
    id: '2',
    supplierId: 'SUP-002',
    name: 'Fresh Harvest Traders',
    contactPerson: 'Ramesh Kumar',
    email: 'sales@freshharvest.com',
    mobile: '9123456780',
    gstNumber: '33BBBBB1111B2Z6'
  },
  {
    id: '3',
    supplierId: 'SUP-003',
    name: 'Daily Needs Wholesale',
    contactPerson: 'Priya Sharma',
    email: 'support@dailyneeds.com',
    mobile: '9988776655',
    gstNumber: '44CCCCC2222C3Z7'
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
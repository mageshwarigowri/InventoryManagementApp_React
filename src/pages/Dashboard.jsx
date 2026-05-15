import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { PIE_COLORS } from '../utils/constants';

const Dashboard = ({ inventory, categories, theme, isDarkMode }) => {
  const metrics = {
    totalItems: inventory.length,
    totalQuantity: inventory.reduce((sum, item) => sum + Number(item.quantity), 0),
    totalValue: inventory.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0)
  };

  const categoryData = categories.map(cat => ({
    name: cat, value: inventory.filter(i => i.category === cat).reduce((sum, i) => sum + Number(i.quantity), 0)
  })).filter(cat => cat.value > 0);

  const barChartData = [...inventory].sort((a, b) => Number(b.quantity) - Number(a.quantity)).slice(0, 10).map(item => ({ name: item.name, quantity: Number(item.quantity) }));

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 no-print">
      <h2 className={`text-2xl font-bold ${theme.textMain} mb-6`}>Overview</h2>
      
      {/* OVERVIEW CARDS */}
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
      
      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PIE CHART */}
        <div className={`${theme.bgCard} p-6 rounded-xl shadow-sm border ${theme.border} flex flex-col items-center`}>
          <h3 className={`text-lg font-semibold ${theme.textMain} mb-6 text-center w-full`}>Stock by Category</h3>
          {/* Hardcoded Dimensions to bypass ResponsiveContainer bug */}
          <PieChart width={350} height={320}>
            <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
              {categoryData.map((e, i) => <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <RechartsTooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', borderColor: isDarkMode ? '#374151' : '#e5e7eb', color: theme.chartText }} />
            <Legend />
          </PieChart>
        </div>

        {/* BAR CHART */}
        <div className={`${theme.bgCard} p-6 rounded-xl shadow-sm border ${theme.border} flex flex-col items-center`}>
          <h3 className={`text-lg font-semibold ${theme.textMain} mb-6 text-center w-full`}>Top 10 Products by Quantity</h3>
          {/* Hardcoded Dimensions to bypass ResponsiveContainer bug */}
          <BarChart width={500} height={320} data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
            <XAxis dataKey="name" tick={{fill: theme.chartText, fontSize: 12}} tickLine={false} axisLine={{stroke: theme.chartGrid}} />
            <YAxis tick={{fill: theme.chartText}} tickLine={false} axisLine={{stroke: theme.chartGrid}} />
            <RechartsTooltip cursor={{fill: isDarkMode ? '#374151' : '#f3f4f6'}} contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', borderColor: isDarkMode ? '#374151' : '#e5e7eb', color: theme.chartText }} />
            <Bar dataKey="quantity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
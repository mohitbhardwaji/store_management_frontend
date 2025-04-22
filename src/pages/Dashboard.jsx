import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area
  } from 'recharts';
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
  
  const salesData = [
    { name: 'Jan', sales: 12000 },
    { name: 'Feb', sales: 18000 },
    { name: 'Mar', sales: 14000 },
    { name: 'Apr', sales: 20000 },
  ];
  
  const inventoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Accessories', value: 300 },
  ];
  
  const electronicsSales = [
    { name: 'TV', sales: 100 },
    { name: 'Mobile', sales: 200 },
    { name: 'Laptop', sales: 150 },
    { name: 'Camera', sales: 80 },
  ];
  
  const topProducts = [
    { name: 'Mobile', sales: 120 },
    { name: 'Laptop', sales: 100 },
    { name: 'TV', sales: 90 },
    { name: 'Headphones', sales: 85 },
    { name: 'Keyboard', sales: 60 },
  ];
  
  const recentSales = [
    { id: 1, product: 'Laptop', quantity: 2, total: '₹2000' },
    { id: 2, product: 'Shirt', quantity: 5, total: '₹250' },
    { id: 3, product: 'Headphones', quantity: 3, total: '₹450' },
  ];
  
  export default function Dashboard() {
    return (
      <div className="p-6 space-y-8">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Overview</h1>
  
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Products Sold" value="235" />
          <SummaryCard title="Inventory Stock" value="890" />
          <SummaryCard title="Net Profit" value="₹12,400" />
          <SummaryCard title="Net Sold" value="₹23,000" />
        </div>
  
        {/* Charts Row 1: Area and Pie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Area Chart */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={salesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
  
          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Inventory Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Charts Row 2: Bar and Horizontal Bar with Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vertical Bar for Category-wise Sales */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Electronics Category-wise Sales</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={electronicsSales}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#82ca9d" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
  
          {/* Horizontal Bar and Table beside it */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Horizontal Bar Chart */}
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-lg font-semibold mb-4">Top 5 Selling Products</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={topProducts}>
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
  
            {/* Table */}
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100 text-gray-700 text-sm">
                    <tr>
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-left">Quantity</th>
                      <th className="p-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-800">
                    {recentSales.map((sale) => (
                      <tr key={sale.id} className="border-t">
                        <td className="p-2">{sale.product}</td>
                        <td className="p-2">{sale.quantity}</td>
                        <td className="p-2">{sale.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function SummaryCard({ title, value }) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow text-center">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-blue-600">{value}</p>
      </div>
    );
  }
  
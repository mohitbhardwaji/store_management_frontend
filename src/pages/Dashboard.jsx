// import {
//     PieChart, Pie, Cell,
//     BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area
//   } from 'recharts';
  
//   const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
  
//   const salesData = [
//     { name: 'Jan', sales: 12000 },
//     { name: 'Feb', sales: 18000 },
//     { name: 'Mar', sales: 14000 },
//     { name: 'Apr', sales: 20000 },
//   ];
  
//   const inventoryData = [
//     { name: 'Electronics', value: 400 },
//     { name: 'Clothing', value: 300 },
//     { name: 'Accessories', value: 300 },
//   ];
  
//   const electronicsSales = [
//     { name: 'TV', sales: 100 },
//     { name: 'Mobile', sales: 200 },
//     { name: 'Laptop', sales: 150 },
//     { name: 'Camera', sales: 80 },
//   ];
  
//   const topProducts = [
//     { name: 'Mobile', sales: 120 },
//     { name: 'Laptop', sales: 100 },
//     { name: 'TV', sales: 90 },
//     { name: 'Headphones', sales: 85 },
//     { name: 'Keyboard', sales: 60 },
//   ];
  
//   const recentSales = [
//     { id: 1, product: 'Laptop', quantity: 2, total: '₹2000' },
//     { id: 2, product: 'Shirt', quantity: 5, total: '₹250' },
//     { id: 3, product: 'Headphones', quantity: 3, total: '₹450' },
//   ];
  
//   export default function Dashboard() {
//     return (
//       <div className="p-6 space-y-8">
//         {/* Heading */}
//         <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Overview</h1>
  
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <SummaryCard title="Products Sold" value="235" />
//           <SummaryCard title="Inventory Stock" value="890" />
//           <SummaryCard title="Net Profit" value="₹12,400" />
//           <SummaryCard title="Net Sold" value="₹23,000" />
//         </div>
  
//         {/* Charts Row 1: Area and Pie */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Area Chart */}
//           <div className="bg-white p-4 rounded-2xl shadow">
//             <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
//             <ResponsiveContainer width="100%" height={250}>
//               <AreaChart data={salesData}>
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#8884d8"
//                   fill="#8884d8"
//                   fillOpacity={0.3}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
  
//           {/* Pie Chart */}
//           <div className="bg-white p-4 rounded-2xl shadow">
//             <h2 className="text-lg font-semibold mb-4">Inventory Breakdown</h2>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={inventoryData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label
//                 >
//                   {inventoryData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
  
//         {/* Charts Row 2: Bar and Horizontal Bar with Table */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Vertical Bar for Category-wise Sales */}
//           <div className="bg-white p-4 rounded-2xl shadow">
//             <h2 className="text-lg font-semibold mb-4">Electronics Category-wise Sales</h2>
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={electronicsSales}>
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="sales" fill="#82ca9d" radius={[10, 10, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
  
//           {/* Horizontal Bar and Table beside it */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Horizontal Bar Chart */}
//             <div className="bg-white p-4 rounded-2xl shadow">
//               <h2 className="text-lg font-semibold mb-4">Top 5 Selling Products</h2>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart layout="vertical" data={topProducts}>
//                   <XAxis type="number" />
//                   <YAxis type="category" dataKey="name" />
//                   <Tooltip />
//                   <Bar dataKey="sales" fill="#ffc658" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
  
//             {/* Table */}
//             <div className="bg-white p-4 rounded-2xl shadow">
//               <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full table-auto">
//                   <thead className="bg-gray-100 text-gray-700 text-sm">
//                     <tr>
//                       <th className="p-2 text-left">Product</th>
//                       <th className="p-2 text-left">Quantity</th>
//                       <th className="p-2 text-left">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm text-gray-800">
//                     {recentSales.map((sale) => (
//                       <tr key={sale.id} className="border-t">
//                         <td className="p-2">{sale.product}</td>
//                         <td className="p-2">{sale.quantity}</td>
//                         <td className="p-2">{sale.total}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   function SummaryCard({ title, value }) {
//     return (
//       <div className="bg-white p-4 rounded-2xl shadow text-center">
//         <h3 className="text-sm text-gray-500">{title}</h3>
//         <p className="text-2xl font-bold text-blue-600">{value}</p>
//       </div>
//     );
//   }
  

import React from 'react';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/button';
import { Input } from '../components/Input';
import { Search, Plus, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { day: 'Sat', sales: 4 },
  { day: 'Sun', sales: 6 },
  { day: 'Mon', sales: 5 },
  { day: 'Tue', sales: 9 },
  { day: 'Wed', sales: 7 },
  { day: 'Thu', sales: 6 },
  { day: 'Fri', sales: 8 },
];

const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Top Cards */}
      <Card className="col-span-1">
        <CardContent className="p-4">
          <h2 className="text-sm text-gray-500">Total Sales</h2>
          <p className="text-2xl font-bold">$7389</p>
          <p className="text-green-500 text-sm">▲ 18% from last week</p>
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardContent className="p-4">
          <h2 className="text-sm text-gray-500">Total Earnings</h2>
          <p className="text-2xl font-bold">$7389</p>
          <p className="text-red-500 text-sm">▼ 14% from last week</p>
        </CardContent>
      </Card>
      <div className="col-span-2 flex justify-end items-center gap-2">
        <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        <Button><Plus className="w-4 h-4 mr-2" /> Create Campaign</Button>
      </div>

      {/* Sales Graph */}
      <Card className="col-span-3">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Total Sales</h2>
            <select className="border rounded px-2 py-1 text-sm">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-green-500 mt-2">▲ 16% from last month</p>
        </CardContent>
      </Card>

      {/* Sales Categories */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Sales Categories</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-black font-medium">Fashion style:</span> 64.16%</p>
            <p><span className="text-black font-medium">Electronics:</span> 32.50%</p>
            <p><span className="text-black font-medium">Entertainment:</span> 24.32%</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card className="col-span-3">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Sales</h2>
            <div className="flex items-center border px-2 py-1 rounded text-sm">
              <Search className="w-4 h-4 mr-2" />
              <Input className="border-none p-0 focus:outline-none" placeholder="Search..." />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Product</th>
                <th>ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Shoe</td>
                <td>#TD7483</td>
                <td>3 June 2024</td>
                <td><span className="bg-green-100 text-green-700 px-2 py-1 rounded">Success</span></td>
                <td>$657</td>
              </tr>
              <tr>
                <td className="py-2">Jacket</td>
                <td>#TD7484</td>
                <td>6 June 2024</td>
                <td><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Pending</span></td>
                <td>$546</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Customer Support */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Customer Support</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <p className="font-medium">Wade Warren <span className="text-gray-500 text-xs">(12 min ago)</span></p>
              <p>I need a property</p>
            </li>
            <li>
              <p className="font-medium">Leslie Alexander <span className="text-gray-500 text-xs">(8 hours ago)</span></p>
              <p>My budget is $500,000</p>
            </li>
            <li>
              <p className="font-medium">Leslie Alexander <span className="text-gray-500 text-xs">(1 day ago)</span></p>
              <p>Thank you so much.😊</p>
            </li>
            <li>
              <p className="font-medium">Ralph Edwards <span className="text-gray-500 text-xs">(3 days ago)</span></p>
              <p>How Much?</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

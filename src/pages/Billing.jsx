import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Billing() {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/bill', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBills(res.data);
      } catch (err) {
        console.error('Failed to fetch bills:', err);
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Invoices</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bills.map((bill) => (
          <div key={bill._id} className="bg-white shadow-lg rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-2">Invoice #{bill._id.slice(-6).toUpperCase()}</h2>
            <p><strong>Date:</strong> {new Date(bill.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Items:</strong> {bill.products.length}</p>
            <p><strong>Total Amount:</strong> ₹{bill.totalAmount}</p>
            <button
              onClick={() => navigate(`/invoice/${bill._id}`)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              View Invoice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

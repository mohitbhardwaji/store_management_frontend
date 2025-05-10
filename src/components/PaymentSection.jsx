import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const PaymentSection = () => {
  const [totalAmount, setTotalAmount] = useState('');
  const [isSplit, setIsSplit] = useState(false);
  const [isCOD, setIsCOD] = useState(false);
  const [advancePayments, setAdvancePayments] = useState([
    { amount: '', mode: '' },
  ]);

  const handleAdvanceChange = (index, field, value) => {
    const updated = [...advancePayments];
    updated[index][field] = value;
    setAdvancePayments(updated);
  };

  const addAdvancePayment = () => {
    setAdvancePayments([...advancePayments, { amount: '', mode: '' }]);
  };

  const sumAdvance = advancePayments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const remainingAmount = totalAmount ? Math.max(Number(totalAmount) - sumAdvance, 0) : 0;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Payment Section</h2>

      {/* Toggle Split Payment */}
      <div className="flex items-center justify-between">
        <label className="font-medium">Enable Split Payment</label>
        <input
          type="checkbox"
          checked={isSplit}
          onChange={(e) => {
            setIsSplit(e.target.checked);
            if (!e.target.checked) {
              setAdvancePayments([{ amount: '', mode: '' }]);
              setIsCOD(false);
            }
          }}
          className="toggle toggle-primary"
        />
      </div>

      {/* Total Amount Input (only if Split Payment is NOT enabled) */}
      {!isSplit && (
        <div className="space-y-2">
          <label className="font-medium">Total Amount to be Paid</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="Enter total amount"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Section 2: Split Payment Details */}
      {isSplit && (
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
          {/* Total Amount Input (inside Split Payment section) */}
          <div className="space-y-2">
            <label className="font-medium">Total Amount</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="Enter total amount"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Advance Payments */}
          <h3 className="text-lg font-semibold text-gray-700">Advance Payment</h3>

          {advancePayments.map((entry, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <input
                type="number"
                value={entry.amount}
                onChange={(e) => handleAdvanceChange(index, 'amount', e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={entry.mode}
                onChange={(e) => handleAdvanceChange(index, 'mode', e.target.value)}
                className="w-full px-4 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Mode</option>
                <option value="cash">Cash</option>
                <option value="card">CC / DC / UPI</option>
              </select>
            </div>
          ))}

          <button
            type="button"
            onClick={addAdvancePayment}
            className="flex items-center gap-2 text-blue-600 mt-2 hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add Another Advance Payment
          </button>

          {/* COD Toggle */}
          <div className="flex items-center justify-between pt-4 border-t">
            <label className="font-medium">Cash on Delivery (COD)</label>
            <input
              type="checkbox"
              checked={isCOD}
              onChange={(e) => setIsCOD(e.target.checked)}
              className="toggle toggle-secondary"
            />
          </div>

          {/* Remaining COD Summary */}
          {isCOD && (
            <div className="mt-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded">
              <strong>Remaining Amount on Delivery: ₹{remainingAmount}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSection;

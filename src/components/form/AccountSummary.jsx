// components/AccountSummary.js

import React from 'react';

const AccountSummary = ({ totalAmount, gstAmount, totalWithGST, advanceAmount,financeTotal,downPayment }) => {
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-6 shadow-md">
      <h2 className="text-xl font-semibold text-[#0D8BC5] mb-4">Amount Summary</h2>
      <div className="flex justify-between mb-2">
        <span className="text-sm">Total Amount (before GST):</span>
        <span className="font-semibold text-xl">₹{totalAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm">GST (18%):</span>
        <span className="font-semibold text-xl">₹{gstAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm">Total Amount (with GST):</span>
        <span className="font-semibold text-xl text-[#1EA0DC]">₹{totalWithGST.toFixed(2)}</span>
      </div>
      {financeTotal && (
        <div className="flex justify-between mb-2">
        <span className="text-sm">Amount With Finance:</span>
        <span className="font-semibold text-xl text-[#1EA0DC]">₹{(Number(financeTotal) + Number(downPayment)).toFixed(2)}</span>
      </div>
      )}
      <div className="flex justify-between mb-2">
        <span className="text-sm">Advance Payment:</span>
        <span className="font-semibold text-xl">₹{advanceAmount}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm">Remaining Amount:</span>
        <span className="font-semibold text-xl text-[#1EA0DC]">
          ₹{(totalWithGST - advanceAmount).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default AccountSummary;

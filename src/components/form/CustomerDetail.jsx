import React from 'react';

const CustomerDetail = ({ customer, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div>
        <label htmlFor="customerName" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Customer Name 
        </label>
        <input
          id="customerName"
          type="text"
          placeholder="Customer Name"
          className="input-style"
          value={customer.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="text"
          placeholder="Phone Number"
          className="input-style"
          value={customer.number}
          onChange={(e) => onChange("number", e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="altNumber" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Alternate Number
        </label>
        <input
          id="altNumber"
          type="text"
          placeholder="Alternate Number (Optional)"
          className="input-style"
          value={customer.alternateNumber || ""}
          onChange={(e) => onChange("alternateNumber", e.target.value)}
        />
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="address" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Address
        </label>
        <input
          id="address"
          type="text"
          placeholder="Address"
          className="input-style"
          value={customer.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>
    </div>
  );
};

export default CustomerDetail;

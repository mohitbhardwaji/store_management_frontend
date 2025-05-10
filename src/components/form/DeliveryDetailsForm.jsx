import React from 'react';

const DeliveryDetailsForm = ({ deliveryDate, salesperson, salespersons, onDeliveryDateChange, onSalespersonChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      <div>
        <label htmlFor="deliveryDate" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Delivery Date
        </label>
        <input
          type="date"
          className="input-style text-gray-500"
          value={deliveryDate}
          onChange={(e) => onDeliveryDateChange(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="salesperson" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Sales Person
        </label>
        <select
          className="input-style text-gray-500"
          value={salesperson}
          onChange={(e) => onSalespersonChange(e.target.value)}
        >
          <option value="">Select Salesperson</option>
          {salespersons.map((person, index) => (
            <option key={index} value={person}>
              {person}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DeliveryDetailsForm;

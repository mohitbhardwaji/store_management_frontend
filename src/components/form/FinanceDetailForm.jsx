import React from 'react';

const FinanceDetailsForm = ({
  financerOptions = [],
  selectedFinancer,
  downPayment,
  tenure,
  roi,
  discount,
  onFinancerChange,
  onDownPaymentChange,
  onTenureChange,
  onROIChange,
  onDiscountChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      {/* Financer Dropdown */}
      <div>
        <label className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Financer
        </label>
        <select
          className="input-style text-gray-500"
          value={selectedFinancer}
          onChange={(e) => onFinancerChange(e.target.value)}
        >
          <option value="">Select Financer</option>
          {financerOptions.map((f, idx) => (
            <option key={idx} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Down Payment */}
      <div>
        <label className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Down Payment
        </label>
        <input
          type="number"
          className="input-style text-gray-500"
          value={downPayment}
          onChange={(e) => onDownPaymentChange(e.target.value)}
        />
      </div>

      {/* Tenure */}
      <div>
        <label className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Tenure (months)
        </label>
        <input
          type="number"
          className="input-style text-gray-500"
          value={tenure}
          onChange={(e) => onTenureChange(e.target.value)}
        />
      </div>

      {/* ROI */}
      <div>
        <label className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Rate of Interest (%)
        </label>
        <input
          type="number"
          className="input-style text-gray-500"
          value={roi}
          onChange={(e) => onROIChange(e.target.value)}
        />
      </div>

      {/* Discount */}
      <div>
        <label className="text-sm font-medium text-[#1EA0DC] mb-1 block">
          Discount (₹)
        </label>
        <input
          type="number"
          className="input-style text-gray-500"
          value={discount}
          onChange={(e) => onDiscountChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FinanceDetailsForm;

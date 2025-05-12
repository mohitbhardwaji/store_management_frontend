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
        <label className="text-sm font-medium text-[#1EA0DC] mb-1 block">Financer</label>
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
        <label className="text-sm font-medium text-[#1EA0DC] mb-1 block">Down Payment</label>
        <input
          type="text"
          className="input-style text-gray-500"
          value={downPayment}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              onDownPaymentChange(value);
            }
          }}
          onBlur={(e) => {
            const value = e.target.value;
            onDownPaymentChange(value === '' ? 0 : parseInt(value));
          }}
        />
      </div>

      {/* Tenure */}
      <div>
        <label className="text-sm font-medium text-[#1EA0DC] mb-1 block">Tenure (months)</label>
        <input
          type="text"
          className="input-style text-gray-500"
          value={tenure}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              onTenureChange(value);
            }
          }}
          onBlur={(e) => {
            const value = e.target.value;
            onTenureChange(value === '' ? 0 : parseInt(value));
          }}
        />
      </div>

      {/* ROI */}
      <div>
        <label className="text-sm font-medium text-[#1EA0DC] mb-1 block">Rate of Interest (%)</label>
        <input
          type="text"
          className="input-style text-gray-500"
          value={roi}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              onROIChange(value);
            }
          }}
          onBlur={(e) => {
            const value = e.target.value;
            onROIChange(value === '' ? 0 : parseFloat(value));
          }}
        />
      </div>

      {/* Discount */}
      <div>
        <label className="text-sm font-medium text-[#1EA0DC] mb-1 block">Discount (₹)</label>
        <input
          type="text"
          className="input-style text-gray-500"
          value={discount}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              onDiscountChange(value);
            }
          }}
          onBlur={(e) => {
            const value = e.target.value;
            onDiscountChange(value === '' ? 0 : parseFloat(value));
          }}
        />
      </div>
    </div>
  );
};

export default FinanceDetailsForm;

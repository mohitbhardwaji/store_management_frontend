import React from 'react';

const FinanceDetailsForm = ({
  financerOptions = [],
  selectedFinancer,
  downPayment,
  tenure,
  roi,
  discount,
  products = [],
  onFinancerChange,
  onDownPaymentChange,
  onTenureChange,
  onROIChange,
  onDiscountChange,
  onProductsChange,
}) => {
  const handleAddSerialNumber = (productIndex) => {
    const updatedProducts = products.map((product, idx) => {
      if (idx === productIndex) {
        const newSNumbers = [...(product.s_number || []), ''];
        return { ...product, s_number: newSNumbers };
      }
      return product;
    });
    onProductsChange(updatedProducts);
  };

  const handleSerialNumberChange = (productIndex, sIdx, value) => {
    const updatedProducts = products.map((product, idx) => {
      if (idx === productIndex) {
        const updatedSNumbers = [...(product.s_number || [])];
        updatedSNumbers[sIdx] = value;
        return { ...product, s_number: updatedSNumbers };
      }
      return product;
    });
    onProductsChange(updatedProducts);
  };

  const handleRemoveSerialNumber = (productIndex, sIdx) => {
    const updatedProducts = products.map((product, idx) => {
      if (idx === productIndex) {
        const updatedSNumbers = [...(product.s_number || [])];
        updatedSNumbers.splice(sIdx, 1);
        return { ...product, s_number: updatedSNumbers };
      }
      return product;
    });
    onProductsChange(updatedProducts);
  };

  return (
    <>
      {/* Serial Number Section */}
      {products.map((product, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
            <h2 className="font-semibold text-[#0D8BC5]">{product.productName || `Product ${index + 1}`}</h2>
            <button
              className="bg-[#0D8BC5] text-white px-3 py-1 rounded hover:bg-[#0a6e98] text-sm w-full sm:w-auto"
              onClick={() => handleAddSerialNumber(index)}
            >
              Add Serial Number
            </button>
          </div>


          {(product.s_number || []).map((serial, sIdx) => (
            <div key={sIdx} className="relative mb-2">
              <input
                type="text"
                value={serial}
                onChange={(e) =>
                  handleSerialNumberChange(index, sIdx, e.target.value)
                }
                className="input-style pr-10 w-full"
              />
              <button
                className="absolute top-1/2 right-2 -translate-y-1/2 text-red-500 font-bold"
                onClick={() => handleRemoveSerialNumber(index, sIdx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ))}

      {/* Finance Fields Section */}
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
    </>
  );
};

export default FinanceDetailsForm;

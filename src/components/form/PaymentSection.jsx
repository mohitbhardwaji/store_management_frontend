import React from 'react';

const PaymentSection = ({
  totalAmount,
  advanceAmount,
  paymentMode,
  transactionId,
  splitPayment,
  secondAdvanceAmount,
  secondPaymentMode,
  secondTransactionId,
  onAdvanceAmountChange,
  onPaymentModeChange,
  onTransactionIdChange,
  onSplitPaymentToggle,
  onSecondAdvanceAmountChange,
  onSecondPaymentModeChange,
  onSecondTransactionIdChange,
}) => {
  const paymentModes = ['cash', 'upi', 'card']; // Removed 'delivery'

  const paidAmount = advanceAmount + (splitPayment ? secondAdvanceAmount : 0);
  const remainingAmount = Math.max(totalAmount - paidAmount, 0);

  return (
    <div className="bg-gray-50 p-4 mt-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <label className="font-medium text-[#1EA0DC]">Split Advance Payment</label>
        <button
          onClick={() => onSplitPaymentToggle(!splitPayment)}
          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
            splitPayment ? 'bg-[#1EA0DC]' : 'bg-gray-300'
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
              splitPayment ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* First Payment Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-medium mb-1 text-sm text-gray-700">Advance Amount</label>
          <input
            type="number"
            value={advanceAmount}
            onChange={e => onAdvanceAmountChange(parseFloat(e.target.value) || 0)}
            className="input-style"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-sm text-gray-700">Payment Mode</label>
          <select
            value={paymentMode}
            onChange={e => onPaymentModeChange(e.target.value)}
            className="input-style"
          >
            {paymentModes.map(mode => (
              <option key={mode} value={mode}>
                {mode.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        {(paymentMode === 'card' || paymentMode === 'upi') && (
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">Transaction ID</label>
            <input
              type="text"
              value={transactionId}
              onChange={e => onTransactionIdChange(e.target.value)}
              className="input-style"
            />
          </div>
        )}
      </div>

      {/* Second Payment Block if Split Enabled */}
      {splitPayment && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">Second Advance Amount</label>
            <input
              type="number"
              value={secondAdvanceAmount}
              onChange={e =>
                onSecondAdvanceAmountChange(parseFloat(e.target.value) || 0)
              }
              className="input-style"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">Second Payment Mode</label>
            <select
              value={secondPaymentMode}
              onChange={e => onSecondPaymentModeChange(e.target.value)}
              className="input-style"
            >
              {paymentModes.map(mode => (
                <option key={mode} value={mode}>
                  {mode.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {(secondPaymentMode === 'card' || secondPaymentMode === 'upi') && (
            <div>
              <label className="block font-medium mb-1 text-sm text-gray-700">Second Transaction ID</label>
              <input
                type="text"
                value={secondTransactionId}
                onChange={e => onSecondTransactionIdChange(e.target.value)}
                className="input-style"
              />
            </div>
          )}
        </div>
      )}

      {/* Remaining Amount for Payment on Delivery */}
      {remainingAmount > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Payment on Delivery Summary</h3>
          <p className="text-sm text-gray-600">Remaining Balance:</p>
          <div className="text-xl font-semibold text-[#1EA0DC]">₹{remainingAmount.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;

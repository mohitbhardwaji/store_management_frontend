import React, { Component, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import logo from '../assets/coolzone.png'

export class ToPrint extends Component {
  render() {
    const {
      formType,
      customerName,
      customerAddress,
      customerPhone,
      customerAltPhone,
      deliveryDate,
      paymentMethod,
      salesperson,
      products,
      totalAmount,
      grandTotalAmount,
      totalGst,
      createdAt,
      _id,
      partialPayment,
      advanceAmount,
      splitPayment,
      payment1,
      payment2,
      
    } = this.props.billData;


    console.log({products})
    return (
      <div ref={this.props.innerRef} className='invoice-container border border-gray-300 pb-4 bg-white text-black'>
        <div className="flex justify-center p-5 bg-[#94989a]">
          <img src={logo} alt="Company Logo" className="h-15 w-auto" />
        </div>
        <div className="p-4 text-sm">
          <div className="mb-2 text-center">
            <h2 className="text-xl font-bold">RAVI ELECTRONICS</h2>
            <p className="text-xs">Opp. Acharan Press, Jinsi Marg No.1, Lashkar, Gwalior (M.P.)</p>
            <p className="text-base font-semibold mt-1">{formType}</p>
          </div>

          <div className="mb-1">
            <div>
              {/* <p><strong>{formType == 'Invoice'?'Invoice No:':''}</strong> {formType == 'Invoice'? _id :""}</p> */}
              <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
              <p><strong>Name:</strong> {customerName}</p>
              <p><strong>Address:</strong> {customerAddress}</p>
              <p><strong>Phone:</strong> {customerPhone}</p>
            </div>
            <div >
              <p><strong>Alternate Phone:</strong> {customerAltPhone}</p>
              <p><strong>Delivery Date:</strong> {new Date(deliveryDate).toLocaleDateString()}</p>
              <p><strong>{formType == 'Invoice'?'Payment Method:':''}</strong> {formType == 'Invoice'? paymentMethod :""}</p>
              {paymentMethod !== 'Cash' &&
  paymentMethod !== 'Split' &&
  this.props.billData.transactionId &&
  this.props.billData.formType === 'Invoice' && (
    <p><strong>Transaction ID:</strong> {this.props.billData.transactionId}</p>
)}
            </div>
          </div>

          <table className="w-full border-collapse border border-gray-300 mb-2 text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">SNo.</th>
                <th className="border px-2 py-1 text-left">Item</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
  {products.map((item, i) => (
    <tr key={i}>
      <td className="border px-2 py-1 text-center">{i+1}</td>
      <td className="border px-2 py-1 text-left">{item.productNumber}</td>
      <td className="border px-2 py-1 text-center">₹{item.customPrice}</td>
      <td className="border px-2 py-1 text-center">{item.quantity}</td>
      <td className="border px-2 py-1 text-center">₹{item.customPrice * item.quantity}</td>
    </tr>
  ))}

  {/* Add GST Calculation here */}
  <tr className="font-semibold">
    <td colSpan="4" className="border px-2 py-1 text-right">Subtotal (Before GST)</td>
    <td className="border px-2 py-1 text-center">
      ₹{totalAmount}
    </td>
  </tr>
  <tr className="font-semibold">
    <td colSpan="4" className="border px-2 py-1 text-right">GST (18%)</td>
    <td className="border px-2 py-1 text-center">
      ₹{(totalGst).toFixed(2)}
    </td>
  </tr>
  <tr className="font-bold">
  <td colSpan="4" className="border px-2 py-1 text-right">Total Amount (Including GST)</td>
  <td className="border px-2 py-1 text-center">
    ₹{(grandTotalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </td>
</tr>
</tbody>

          </table>

          {partialPayment && (
            <div className="mb-2 text-xs">
              <p><strong>Advance Paid:</strong> ₹{advanceAmount}</p>
              <p><strong>Balance Due:</strong> ₹{Math.max((grandTotalAmount.toFixed(2)) - advanceAmount, 0)}</p>
            </div>
          )}

          { payment1 && (
            <div className="mb-2 text-xs">
              <p className="font-semibold">Payment Details:</p>
              {payment1 && payment1.amount > 0 && (
                <p>
                  <strong>Payment 1 ({payment1.mode}):</strong> ₹{payment1.amount}
                  {payment1.transactionId && ` (Transaction ID: ${payment1.transactionId})`}
                </p>
              )}
              {payment2 && payment2.amount > 0 && (
                <p>
                  <strong>Payment 2 ({payment2.mode}):</strong> ₹{payment2.amount}
                  {payment2.transactionId && ` (Transaction ID: ${payment2.transactionId})`}
                </p>
              )}
              {payment1?.amount + payment2?.amount < totalAmount && (
                <p className="font-semibold text-red-600">
                  Remaining Due: ₹{grandTotalAmount - (payment1?.amount || 0) - (payment2?.amount || 0)}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between text-xs mt-4">
            <div>Sales Executive: {salesperson}</div>
            <div className="text-right">Authorized Signatory</div>
          </div>
        </div>
      </div>
    );
  }
}
const CustomerOrder = () => {
  const { state } = useLocation();
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

  if (!state) return <p className="text-center mt-10">No bill data available</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black">
      <ToPrint innerRef={contentRef} billData={state} />

      <div className="text-center mt-10 print-button">
        <button
          onClick={handlePrint}
          className="bg-[#149cd9] hover:bg-[#5ab7e0] text-white px-6 py-2 rounded text-sm"
        >
          Print Order Bill
        </button>
      </div>
    </div>
  );
};
export default CustomerOrder;

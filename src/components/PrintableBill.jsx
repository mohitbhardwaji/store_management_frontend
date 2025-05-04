import React from 'react';
import logo from '../assets/coolzone.png'

const PrintableInvoice = React.forwardRef(({ billData }, ref) => {
  if (!billData) return null;

  const {
    customerName,
    customerAddress,
    customerPhone,
    customerAltPhone,
    deliveryDate,
    transactionId,
    paymentMethod,
    salesperson,
    products,
    totalAmount,
    createdAt,
    _id,
  } = billData;

  return (
    <div ref={ref} className="invoice-container border border-gray-300 pb-4 bg-white text-black">
      <div className="flex justify-center p-5 bg-[#94989a]">
        <img src={logo} alt="Company Logo" className="h-15 w-auto" />
      </div>
      <div className="p-4 text-sm">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold">RAVI ELECTRONICS</h2>
          <p className="text-xs">Opp. Acharan Press, Jinsi Marg No.1, Lashkar, Gwalior (M.P.)</p>
          <p className="text-base font-semibold mt-2">INVOICE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 mb-2">
          <div>
            <p><strong>Invoice No:</strong> {_id}</p>
            <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
            <p><strong>Name:</strong> {customerName}</p>
            <p><strong>Address:</strong> {customerAddress}</p>
            <p><strong>Phone:</strong> {customerPhone}</p>
          </div>
          <div className="text-right">
            <p><strong>Alternate Phone:</strong> {customerAltPhone}</p>
            <p><strong>Delivery Date:</strong> {new Date(deliveryDate).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> {paymentMethod}</p>
            <p><strong>Transaction ID:</strong> {transactionId}</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300 mb-4 text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Co.</th>
              <th className="border px-2 py-1 text-left">Item</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 text-center">{item.product_group}</td>
                <td className="border px-2 py-1 text-left">{item.productName}</td>
                <td className="border px-2 py-1 text-center">₹{item.customPrice}</td>
                <td className="border px-2 py-1 text-center">{item.quantity}</td>
                <td className="border px-2 py-1 text-center">₹{item.customPrice * item.quantity}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td colSpan="4" className="border px-2 py-1 text-right">Total Amount</td>
              <td className="border px-2 py-1 text-center">₹{totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between text-xs mt-4">
          <div>Sales Executive: {salesperson}</div>
          <div className="text-right">Authorized Signatory</div>
        </div>
      </div>
    </div>
  );
});

export default PrintableInvoice;

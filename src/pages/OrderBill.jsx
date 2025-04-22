import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';

const OrderBillPage = () => {
  const { state } = useLocation();
  const printRef = useRef();

  if (!state) return <p className="text-center mt-10">No bill data available</p>;

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
  } = state;

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Order Bill</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @page {
              size: A5 portrait;
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
              padding: 0;
              font-size: 10pt;
              background: white;
            }
            .print-button {
              display: none !important;
            }
            .invoice-container {
              border: none !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 4px;
              border: 1px solid #ccc;
            }
          </style>
        </head>
        <body class="p-4 font-sans text-black bg-white text-sm">
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };
  

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black">
      <div ref={printRef} className="invoice-container border border-gray-300 p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">RAVI ELECTRONICS</h2>
            <p className="text-xs">Opp. Acharan Press, Jinsi Marg No.1, Lashkar, Gwalior (M.P.)</p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold">ORDER BILL</p>
          </div>
        </div>

        <div className="mb-2 text-sm">
          <p><strong>Invoice No:</strong> {_id}</p>
          <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
          <p><strong>Name:</strong> {customerName}</p>
          <p><strong>Address:</strong> {customerAddress}</p>
          <p><strong>Phone:</strong> {customerPhone}</p>
          <p><strong>Alternate Phone:</strong> {customerAltPhone}</p>
          <p><strong>Delivery Date:</strong> {new Date(deliveryDate).toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
          <p><strong>Transaction ID:</strong> {transactionId}</p>
          <p><strong>Salesperson:</strong> {salesperson}</p>
        </div>

        <table className="w-full border-collapse border border-gray-300 mb-4 text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1 text-left">Item</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 text-center">{i + 1}</td>
                <td className="border px-2 py-1 text-left">{item.name}</td>
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

      <div className="text-center mt-10 print-button">
        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm"
        >
          Print Order Bill
        </button>
      </div>
    </div>
  );
};

export default OrderBillPage;

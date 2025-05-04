import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { apiServerUrl } from '../constant/constants';

const InvoicePage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const printRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!state && id) {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${apiServerUrl}/bill/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setInvoice(res.data);
        } catch (err) {
          console.error('Failed to fetch invoice:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchInvoice();
  }, [id, state]);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Estimate/Order Form</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              .print-button {
                display: none;
              }
              .invoice-container {
                border: none !important;
              }
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

  if (loading) return <p className="text-center mt-10">Loading invoice...</p>;
  if (!invoice) return <p className="text-center mt-10">No invoice data available</p>;

  const { products, totalAmount, _id, createdAt } = invoice;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black">
      <div ref={printRef} className="invoice-container border border-gray-300 p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="text-left">
            <h2 className="text-xl font-bold m-0">RAVI ELECTRONICS</h2>
            <p className="m-0 text-xs">Opp. Acharan Press, Jinsi Marg No.1,</p>
            <p className="m-0 text-xs">Lashkar, Gwalior (M.P.)</p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold">ESTIMATE / ORDER FORM</p>
          </div>
        </div>

        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <label className="mr-2 text-sm">Invoice No.</label>
            <span className=" inline-block text-sm">
              {_id}
            </span>
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-sm">Date</label>
            <span className="border-b border-black w-24 inline-block text-sm">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mb-2">
          <label className="mr-2 text-sm">Name</label>
        </div>

        <div className="mb-4">
          <label className="mr-2 text-sm">Address</label>
        </div>

        <div className="mb-4">
          <label className="mr-2 text-sm">Ph/Mob</label>
        </div>

        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-1 text-center text-xs">CO.</th>
              <th className="border border-gray-300 px-2 py-1 text-center text-xs">ITEM</th>
              <th className="border border-gray-300 px-2 py-1 text-center text-xs">RATE</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="item-row">
                  <td className="border border-gray-300 px-2 py-1 text-center text-xs">{index + 1}</td>
                  <td className="border border-gray-300 px-2 py-1 text-left text-xs">{item.name}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center text-xs">₹{item.price}</td>
                </tr>
               
              </React.Fragment>
            ))}
            
          </tbody>
        </table>

        <div className="flex justify-between mb-4">
          <div className="border border-gray-300 p-2 text-xs">Remarks, about delivery</div>
          <div className="border border-gray-300 p-2 text-xs">Remarks, about payment</div>
        </div>

        <div className="flex justify-between text-xs mt-4">
          <div>Sales Executive</div>
          <div className="text-right">Authority</div>
        </div>
      </div>

      <div className="text-center mt-10 print-button">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm"
        >
          Print Estimate/Order Form
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
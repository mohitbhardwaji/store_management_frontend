import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/coolzone.png';
import Loader from '../components/Loader';

export default function ViewInvoice() {
  const { id } = useParams();
  console.log({id})
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${apiServerUrl}/bill/id?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log({res})
        setBillData(res.data);
      } catch (err) {
        toast.error('Failed to fetch invoice details');
      }
    };
    fetchBill();
  }, [id]);

  if (!billData) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>
  );

  const {
    _id,
    customerName,
    customerAddress,
    customerPhone,
    customerAltPhone,
    deliveryDate,
    createdAt,
    products,
    totalAmount,
    paymentMethod,
    formType,
    transactionId,
    partialPayment,
    advanceAmount,
    splitPayment,
    payment1,
    payment2,
    salesperson,
  } = billData;

 
  const getTotalGST = () => {
    let totalGST = 0;
    products.forEach((product) => {

        const price = product.customPrice || 0; 
        const gstRate = product.gst || 0;
        totalGST += (price * gstRate) / 100;

    
    });
   
    return totalGST;
};

const getTotalSelling = () => {
  return products.reduce((sum, p) => sum + (p.customPrice * (p.quantity || 1)), 0);
};

const getGrandTotal = () => {
        
  return getTotalSelling() + getTotalGST();
};

const gstAmount = +(totalAmount - totalAmount / 1.18).toFixed(2);
const totalWithGST = +(totalAmount + gstAmount).toFixed(2);

const totalSplitPaid = (payment1?.amount || 0) + (payment2?.amount || 0);

const balanceDue = +(getGrandTotal() - ((advanceAmount? advanceAmount : payment1?.amount )|| 0)).toFixed(2);


  return (
    <div className="invoice-container border border-gray-300 pb-4 bg-white text-black max-w-4xl mx-auto my-6 shadow-lg">
      <div className="flex justify-center p-5 bg-[#94989a]">
        <img src={logo} alt="Company Logo" className="h-16 w-auto" />
      </div>
      <div className="p-4 text-sm">
        <div className="mb-2 text-center">
          <h2 className="text-xl font-bold">RAVI ELECTRONICS</h2>
          <p className="text-xs">Opp. Acharan Press, Jinsi Marg No.1, Lashkar, Gwalior (M.P.)</p>
          <p className="text-base font-semibold mt-3 mb-5">{formType === 'Invoice' ? 'INVOICE' : formType=== 'Order Form'? 'Order Form':'Estimate'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            {formType === 'Invoice' && <p><strong>Invoice No:</strong> {_id}</p>}
            <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
            <p><strong>Name:</strong> {customerName}</p>
            <p><strong>Address:</strong> {customerAddress}</p>
            <p><strong>Phone:</strong> {customerPhone}</p>
          </div>
          <div>
            <p><strong>Alternate Phone:</strong> {customerAltPhone}</p>
            <p><strong>Delivery Date:</strong> {new Date(deliveryDate).toLocaleDateString()}</p>
            {formType === 'Invoice' && (
              <>
                <p><strong>Payment Method:</strong> {paymentMethod}</p>
                {paymentMethod !== 'Cash' && paymentMethod !== 'Split' && transactionId && (
                  <p><strong>Transaction ID:</strong> {transactionId}</p>
                )}
              </>
            )}
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
                <td className="border px-2 py-1 text-center">{i+1}</td>
                <td className="border px-2 py-1">{item.productNumber}</td>
                <td className="border px-2 py-1 text-center">₹{item.customPrice}</td>
                <td className="border px-2 py-1 text-center">{item.quantity}</td>
                <td className="border px-2 py-1 text-center">₹{item.customPrice * item.quantity}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td colSpan="4" className="border px-2 py-1 text-right">Subtotal (Before GST)</td>
              <td className="border px-2 py-1 text-center">₹{totalAmount}</td>
            </tr>
            <tr className="font-semibold">
              <td colSpan="4" className="border px-2 py-1 text-right">GST (18%)</td>
              <td className="border px-2 py-1 text-center">₹{getTotalGST()}</td>
            </tr>
            <tr className="font-bold">
              <td colSpan="4" className="border px-2 py-1 text-right">Total Amount (Incl. GST)</td>
              <td className="border px-2 py-1 text-center">₹{getGrandTotal().toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        {partialPayment && (
          <div className="text-xs mb-3">
            <p><strong>Advance Paid:</strong> ₹{advanceAmount}</p>
            <p><strong>Balance Due:</strong> ₹{balanceDue}</p>
          </div>
        )}

        {splitPayment && (
          <div className="text-xs mb-3">
            <p className="font-semibold">Payment Details:</p>
            {payment1?.amount > 0 && (
              <p>
                <strong>Payment 1 ({payment1.mode}):</strong> ₹{payment1.amount}
                {payment1.transactionId && ` (Transaction ID: ${payment1.transactionId})`}
              </p>
            )}
            {payment2?.amount > 0 && (
              <p>
                <strong>Payment 2 ({payment2.mode}):</strong> ₹{payment2.amount}
                {payment2.transactionId && ` (Transaction ID: ${payment2.transactionId})`}
              </p>
            )}
            {totalSplitPaid < totalAmount && (
              <p className="text-red-600 font-semibold">
                Remaining Due: ₹{totalAmount - totalSplitPaid}
              </p>
            )}
          </div>
        )}

        <div className="text-xs mt-4">
          <p><strong>Sales Executive:</strong> {salesperson || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

}

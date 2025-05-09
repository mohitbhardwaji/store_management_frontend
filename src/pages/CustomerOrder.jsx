import React, { Component, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import logo from '../assets/coolzone.png'
import axios from 'axios';
import { apiServerUrl } from '../constant/constants';
import { toast } from 'react-toastify';
// import { calculateFinanceDetails } from '../constant/commonFunction';

export class ToPrint extends Component {
  render() {
    const {
      _id,
      formType,
      customerName,
      customerAddress,
      customerPhone,
      customerAltPhone,
      deliveryDate,
      paymentMethod,
      salesperson,
      products = [],
      createdAt,
      transactionId,
      finance_id = {}, 
      partialPayment,
      advanceAmount = 0,
      splitPayment,
      payment1 = {},
      payment2 = {},
    } = this.props.billData || {};
    const {priceAfterFinance} = this.props.financeData
    const calculateAmount = (products) => {
      let totalAmount = 0;
      let totalGST = 0;

      products.forEach(product => {
        const price = Number(product.customPrice || 0);
        const quantity = Number(product.quantity || 1);
        const gst = Number(product.gst || 0);

        totalAmount += price * quantity;
        totalGST += (price * gst / 100) * quantity;
      });

      const totalWithGST = totalAmount;
      const withoutGST = totalAmount - totalGST;

      return {
        calTotalwithoutAmount: withoutGST,
        calTotalGST: totalGST,
        calTotalWithGST: totalWithGST,
      };
    };

    const { calTotalwithoutAmount, calTotalGST, calTotalWithGST } = calculateAmount(products);




    return (
      <div ref={this.props.innerRef} className="invoice-container border border-gray-300 pb-4 bg-white text-black">
        <div className="flex justify-center p-5 bg-[#94989a]">
          <img src={logo} alt="Company Logo" className="h-15 w-auto" />
        </div>

        <div className="p-4 text-sm">
          <div className="mb-2 text-center">
            <p className="text-base font-semibold mt-1">{formType}</p>
            <p>9669695731</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 text-xs ">
            <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
            <p><strong>Name:</strong> {customerName}</p>
            <p><strong>Phone:</strong> {customerPhone}</p>
            <p><strong>Alternate Phone:</strong> {customerAltPhone}</p>
            <p><strong>Delivery Date:</strong> {new Date(deliveryDate).toLocaleDateString()}</p>
            <p><strong>Sales Executive:</strong> {salesperson}</p>
            {formType === 'Invoice' && (
              <>
                {/* <p><strong>Payment Method:</strong> {paymentMethod}</p>
                {paymentMethod !== 'Cash' && paymentMethod !== 'Split' && transactionId && (
                  <p><strong>Transaction ID:</strong> {transactionId}</p>
                )} */}
                 <p><strong>Invoice Number:</strong> {_id}</p>
                 
              </>
            )}
            {formType !== 'Estimate'&&(
              <p><strong>GST No:</strong>23AESPJ5532J1ZA</p>
            )}
          </div>

          <div className="text-xs mb-2">
            <p><strong>Address:</strong> {customerAddress}</p>
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
              {[...products, ...Array(10 - products.length)].map((item, i) => (
                <tr key={i}>
                <td className={`${item ? 'border' : ''} px-2 py-1 text-center`}>
                  {item ? i + 1 : <div className="h-4" />}
                </td>
                <td className={`${item ? 'border' : ''} px-2 py-1 text-left`}>
                  {item?.productNumber || <div className="h-4" />}
                </td>
                <td className={`${item ? 'border' : ''} border  px-2 py-1 text-center`}>
                  {item ? `₹${(item.customPrice - (item.customPrice * item.gst / 100)).toFixed(2)}` : <div className="h-4" />}
                </td>
                <td className={`${item ? 'border' : ''} border px-2 py-1 text-center`}>
                  {item?.quantity || <div className="h-4" />}
                </td>
                <td className={`${item ? 'border' : ''} border px-2 py-1 text-center`}>
                  {item ? `₹${((item.customPrice - (item.customPrice * item.gst / 100)) * item.quantity).toFixed(2)}` : <div className="h-4" />}
                </td>
              </tr>
              
              ))}

              <tr className="font-semibold">
                <td colSpan="4" className="border px-2 py-1 text-right">Subtotal (Before GST)</td>
                <td className="border px-2 py-1 text-center">₹{calTotalwithoutAmount.toFixed(2)}</td>
              </tr>
              <tr className="font-semibold">
                <td colSpan="4" className="border px-2 py-1 text-right">GST</td>
                <td className="border px-2 py-1 text-center">₹{calTotalGST.toFixed(2)}</td>
              </tr>
              <tr className="font-bold">
                <td colSpan="4" className="border px-2 py-1 text-right">Total Amount (Including GST)</td>
                <td className="border px-2 py-1 text-center">
                  ₹{calTotalWithGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
            {formType !== 'Estimate' && (partialPayment || payment1.amount || payment2.amount) && (
              <div className="text-xs">
                {partialPayment && (
                  <>
                    <p><strong>Advance Paid:</strong> ₹{advanceAmount.toFixed(2)}</p>
                    <p><strong>Balance Due:</strong> ₹{(calTotalWithGST - advanceAmount).toFixed(2)}</p>
                  </>
                )}
                {(payment1.amount || payment2.amount) && (
                  <>
                    <p className="font-semibold">Payment Details:</p>
                    {payment1.amount > 0 && (
                      <p><strong>Payment 1 ({payment1.mode}):</strong> ₹{payment1.amount} {payment1.transactionId && `(Transaction ID: ${payment1.transactionId})`}</p>
                    )}
                    {payment2.amount > 0 && (
                      <p><strong>Payment 2 ({payment2.mode}):</strong> ₹{payment2.amount} {payment2.transactionId && `(Transaction ID: ${payment2.transactionId})`}</p>
                    )}
                    {(payment1.amount || 0) + (payment2.amount || 0) < calTotalWithGST && (
                      <p className="font-semibold text-red-600">
                        Remaining Due: ₹{(calTotalWithGST - (payment1.amount || 0) - (payment2.amount || 0)).toFixed(2)}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {finance_id?.financerName && (
              <div className="text-xs rounded">
                <p><strong>Financer Name:</strong> {finance_id.financerName}</p>
                <p><strong>Downpayment:</strong> ₹{finance_id.downpayment}</p>
                <p><strong>EMI Tenure:</strong> {finance_id.emiTenure} months</p>
                <p><strong>Rate of Interest:</strong> {finance_id.roi}%</p>
                <p><strong>Discount:</strong> ₹{finance_id.discount}</p>
                <p><strong>Price After Finance:</strong> ₹{(Number(priceAfterFinance)+Number(finance_id.downpayment)).toFixed(2)}</p>
              </div>
            )}
          </div>
          <div className="text-xs rounded text-left">
            signature:
          </div>
        </div>
      </div>
    );
  }
}


const CustomerOrder = () => {
  const { billId } = useParams();
  const [state, setState] = useState(null);
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!billId) return;

    const fetchBillAndFinance = async () => {
      try {
        const token = localStorage.getItem('token');

        // 1. Fetch the bill
        const res = await axios.get(`${apiServerUrl}/bill/fetch-bill?bill_id=${billId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bill = res.data.bills[0];
        setState(bill);

       const payload = {
        product_rate:bill.totalAmount,
        downpayment:bill.finance_id.downpayment,
          emiTenure:bill.finance_id.emiTenure,
          roi:bill.finance_id.roi,
          discount:bill.finance_id.discount
       }

        // 3. Call the finance API
       if(bill.finance_id){ 
        const financeRes = await axios.post(`${apiServerUrl}/finance/calculate`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setFinanceData(financeRes.data);
      }
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error('Token Expired. Please login again.');
          navigate('/login');
        } else {
          toast.error('Failed to fetch invoice or finance details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBillAndFinance();
  }, [billId]);

  const handlePrint = useReactToPrint({ contentRef });

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!state) return <p className="text-center mt-10">No bill data available</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black">
      <ToPrint innerRef={contentRef} billData={state} financeData={financeData} />

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

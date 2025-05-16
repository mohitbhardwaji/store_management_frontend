import React, { Component, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import logo from '../assets/coolzone.png'
import axios from 'axios';
import { apiServerUrl } from '../constant/constants';
import { toast } from 'react-toastify';
import PDFGenerator from './PDFGenerator';
// import { calculateFinanceDetails } from '../constant/commonFunction';

export class ToPrint extends Component {
  render() {
    const {
      _id,
      serialNumber,
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
    const {priceAfterFinance,emiPerMonth} = this.props?.financeData || {}
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
        <div className="flex justify-center p-3 " style={{ backgroundColor: "#94989a" }} >
          <img src={logo} alt="Company Logo" className="h-15 w-auto " />
        </div>

        <div className="p-2 text-[10px]">
          <div className="mb-1 text-base text-center">
            <p className="text-base font-semibold ">{formType}</p>
          </div>

<div className='w-full text-right'>
            <p><strong>Serial No:</strong> {serialNumber}</p>
{formType !== 'Estimate'&&(
              <p><strong>GST No:</strong>23AESPJ5532J1ZA</p>
            )}
            <p><strong>Sales Executive:</strong> {salesperson.name}</p>
            <p><strong>Sales Contact:</strong> {salesperson.mobileNumber}</p>
</div>
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 text-[10px] ">
            
            <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
            <p><strong>Name:</strong> {customerName}</p>
            <p><strong>Delivery Date:</strong> {new Date(deliveryDate).toLocaleDateString()}</p>
            <p><strong>Phone:</strong> {customerPhone}</p>
            <p><strong>Alternate Phone:</strong> {customerAltPhone}</p>
            
            {formType === 'Invoice' && (
              <>
                {/* <p><strong>Payment Method:</strong> {paymentMethod}</p>
                {paymentMethod !== 'Cash' && paymentMethod !== 'Split' && transactionId && (
                  <p><strong>Transaction ID:</strong> {transactionId}</p>
                )} */}
                 <p><strong>Invoice Number:</strong> {_id}</p>
                 
              </>
            )}
           
          </div>

          <div className="mb-2">
            <p><strong>Address:</strong> {customerAddress}</p>
          </div>

          <table className="w-full border-collapse border border-gray-300 mb-1 text-[10px]">
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
                <td className={`${item ? 'border' : 'border-l'} px-2  text-center`}>
                  {item ? i + 1 : <div className="h-4" />}
                </td>
                <td className={`${item ? 'border' : ''} px-2 text-left`}>
  {item?.productNumber}
  
  {item?.s_number?.length > 0 && (
    <div className=" pl-4">
      {item.s_number.map((serial, index) => (
        <div key={index}>S No: {serial}</div>
      ))}
    </div>
  )}
</td>
                <td className={`${item ? 'border' : ''} border  px-2  text-center`}>
                  {item ? `₹${(item.customPrice - (item.customPrice * item.gst / 100)).toFixed(2)}` : <div className="h-4" />}
                </td>
                <td className={`${item ? 'border' : ''} border px-2  text-center`}>
                  {item?.quantity || <div className="h-4" />}
                </td>
                <td className={`${item ? 'border' : ''} border px-2  text-center`}>
                  {item ? `₹${((item.customPrice - (item.customPrice * item.gst / 100)) * item.quantity).toFixed(2)}` : <div className="h-4" />}
                </td>
              </tr>
              
              ))}

              <tr className="font-semibold">
                <td colSpan="4" className="border px-2 text-right">Subtotal (Before GST)</td>
                <td className="border px-2 text-center">₹{calTotalwithoutAmount.toFixed(2)}</td>
              </tr>
              <tr className="font-semibold">
                <td colSpan="4" className="border px-2  text-right">CGST</td>
                <td className="border px-2 text-center">₹{(calTotalGST.toFixed(2)/2)}</td>
              </tr>
              <tr className="font-semibold">
                <td colSpan="4" className="border px-2  text-right">SGST</td>
                <td className="border px-2 text-center">₹{(calTotalGST.toFixed(2)/2)}</td>
              </tr>
              <tr className="font-bold">
                <td colSpan="4" className="border px-2 text-right">Total Amount (Including GST)</td>
                <td className="border px-2 text-center">
                  ₹{calTotalWithGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="relative min-h-[200px]"> {/* Adjust height as needed */}
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-0">
  {/* Payment Details */}
  {formType !== 'Estimate' && (partialPayment || payment1?.amount || (partialPayment && payment2?.amount)) && (
  <div className="text-[10px]">
    {partialPayment && (
      <>
        <p><strong>Advance Paid:</strong> ₹{advanceAmount.toFixed(2)}</p>
        <p><strong>Balance Due:</strong> ₹{(calTotalWithGST - advanceAmount).toFixed(2)}</p>
      </>
    )}
    
    {(payment1?.amount || (partialPayment && payment2?.amount)) && (
      <>
        <p className="font-semibold">Payment Details:</p>
        
        {payment1?.amount > 0 && (
          <p>
            <strong>Payment 1 ({payment1.mode}):</strong> ₹{payment1.amount}
            {payment1.transactionId && ` (Transaction ID: ${payment1.transactionId})`}
          </p>
        )}
        
        {partialPayment && payment2?.amount > 0 && (
          <p>
            <strong>Payment 2 ({payment2.mode}):</strong> ₹{payment2.amount}
            {payment2.transactionId && ` (Transaction ID: ${payment2.transactionId})`}
          </p>
        )}

        {(payment1?.amount || 0) + (partialPayment ? (payment2?.amount || 0) : 0) < calTotalWithGST && (
          <p className="font-semibold text-red-600">
            Remaining Due: ₹{(calTotalWithGST - ((payment1?.amount || 0) + (partialPayment ? (payment2?.amount || 0) : 0))).toFixed(2)}
          </p>
        )}
      </>
    )}
  </div>
)}



  {finance_id?.financerName && (
    <div className="text-[10px]">
      <p><strong>Financer Name:</strong> {finance_id.financerName}</p>
      <p><strong>Downpayment:</strong> ₹{finance_id.downpayment}</p>
      <p><strong>EMI Tenure:</strong> {finance_id.emiTenure} months</p>
      <p><strong>EMI Amount:</strong> ₹{emiPerMonth} /month</p>
      <p><strong>Rate of Interest:</strong> {finance_id.roi}%</p>
      <p><strong>Price After Finance:</strong> ₹{(Number(priceAfterFinance)+Number(finance_id.downpayment)).toFixed(2)}</p>
    </div>
  )}
  
</div>

{/* Signature slightly above bottom */}
<div className="absolute bottom-2 right-0 text-[10px] text-right pr-2">
  Authorized Signature
</div>  

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
      
       if (bill.finance_id) {
        const payload = {
          product_rate: bill.totalAmount,
          downpayment: bill.finance_id.downpayment,
          emiTenure: bill.finance_id.emiTenure,
          roi: bill.finance_id.roi,
          discount: bill.finance_id.discount,
        };
      
        const financeRes = await axios.post(`${apiServerUrl}/finance/calculate`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      
        const result = financeRes.data;
      
        const emiPerMonth = ((Number(result.priceAfterFinance) + Number(bill?.finance_id?.file_charge)) / payload.emiTenure).toFixed(2);
        const totalPayable = result.priceAfterFinance.toFixed(2);
        console.log(emiPerMonth)
        setFinanceData({
          ...result,
          emiPerMonth,
          totalPayable,
          tenure: payload.emiTenure,
        });
      }
     
      } catch (err) {
        console.log("in cath block",err)
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
  console.log(state)
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black">
      <PDFGenerator billData={state} financeData={financeData} />
    </div>
  );
};


export default CustomerOrder;

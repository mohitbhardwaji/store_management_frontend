import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../assets/coolzone.png'

const PDFGenerator = ({
    billData,
    financeData
}) => {

  const contentRef = useRef();
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
  } = billData || {};
  const {priceAfterFinance,emiPerMonth} = financeData || {}

  console.log({billData})
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





  const generatePDF = () => {
    console.log("button clicked")
    const input = contentRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a5');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('download.pdf');
    });
  };

  return (
    <div className="p-4">
    <div ref={contentRef} className="invoice-container border pb-4 bg-white text-black" style={{ borderColor: "#d1d5db" }}>
      <div className="flex justify-center p-3" style={{ backgroundColor: "#94989a" }} > 
        <img src={logo} alt="Company Logo" className="h-15 w-auto" />
      </div>

      <div className="p-2 text-[10px]">
        <div className="mb-1 text-base text-center">
          <p className="text-base font-semibold">{formType}</p>
        </div>

        <div className="w-full text-right">
          <p><strong>Serial No:</strong> {serialNumber}</p>
          {formType !== 'Estimate' && (
            <p><strong>GST No:</strong> 23AESPJ5532J1ZA</p>
          )}
          <p><strong>Sales Executive:</strong> {salesperson.name}</p>
          <p><strong>Sales Contact:</strong> {salesperson.mobileNumber}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 text-[10px]">
          <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
          <p><strong>Name:</strong> {customerName}</p>
          <p><strong>Delivery Date:</strong> {new Date(deliveryDate).toLocaleDateString()}</p>
          <p><strong>Phone:</strong> {customerPhone}</p>
          <p><strong>Alternate Phone:</strong> {customerAltPhone}</p>
          {formType === 'Invoice' && (
            <>
              <p><strong>Invoice Number:</strong> {_id}</p>
            </>
          )}
        </div>

        <div className="mb-2">
          <p><strong>Address:</strong> {customerAddress}</p>
        </div>

        <table className="w-full border-collapse border mb-1 text-[10px]" >
          <thead>
            <tr>
              <th className="border px-2 py-1" >SNo.</th>
              <th className="border px-2 py-1 text-left" >Item</th>
              <th className="border px-2 py-1" >Price</th>
              <th className="border px-2 py-1" >Qty</th>
              <th className="border px-2 py-1" >Total</th>
            </tr>
          </thead>
          <tbody>
            {[...products, ...Array(10 - products.length)].map((item, i) => (
              <tr key={i}>
                <td className={`${item ? 'border' : 'border-l'} px-2 py-1 text-center`} >
                  {item ? i + 1 : <div className="h-4" />}
                </td>
                <td className={`${item ? 'border' : ''} px-2 py-1 text-left`} >
                  {item?.productNumber}
                  {item?.s_number?.length > 0 && (
                    <div className="pl-4">
                      {item.s_number.map((serial, index) => (
                        <div key={index}>S No: {serial}</div>
                      ))}
                    </div>
                  )}
                </td>
                <td className={`${item ? 'border' : ''} border px-2 py-1 text-center`} >
                  {item ? `₹${(item.customPrice - (item.customPrice * item.gst / 100)).toFixed(2)}` : <div className="h-4" />}
                </td>
                <td className={`${item ? 'border' : ''} border px-2 py-1 text-center`}  >
                  {item?.quantity || <div className="h-4" />}
                </td>
                <td className={`${item ? 'border' : ''} border px-2 py-1 text-center`}  >
                  {item ? `₹${((item.customPrice - (item.customPrice * item.gst / 100)) * item.quantity).toFixed(2)}` : <div className="h-4" />}
                </td>
              </tr>
            ))}

            <tr className="font-semibold">
              <td colSpan="4" className="border px-2 py-1 text-right"  >Subtotal (Before GST)</td>
              <td className="border px-2 text-center py-1"  >₹{calTotalwithoutAmount.toFixed(2)}</td>
            </tr>
            <tr className="font-semibold">
              <td colSpan="4" className="border px-2 py-1 text-right"  >CGST</td>
              <td className="border px-2 text-center py-1"  >₹{(calTotalGST.toFixed(2) / 2)}</td>
            </tr>
            <tr className="font-semibold">
              <td colSpan="4" className="border px-2 text-right py-1"  >SGST</td>
              <td className="border px-2 text-center py-1"  >₹{(calTotalGST.toFixed(2) / 2)}</td>
            </tr>
            <tr className="font-bold">
              <td colSpan="4" className="border px-2 text-right py-1"  >Total Amount (Including GST)</td>
              <td className="border px-2 text-center py-1"  >
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
    <button
      onClick={generatePDF}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Download PDF
    </button>
  </div>
  );
};

export default PDFGenerator;

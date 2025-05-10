import React, { useEffect, useState } from 'react';
import CustomerDetail from '../components/form/CustomerDetail';
import ProductItemsSection from '../components/form/ProductItemsSection';
import DeliveryDetailsForm from '../components/form/DeliveryDetailsForm';
import FinanceDetailsForm from '../components/form/FinanceDetailForm';
import AccountSummary from '../components/form/AccountSummary';
import PaymentSection from '../components/form/PaymentSection';
import { apiServerUrl } from '../constant/constants';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('Order Form');
  const [customer, setCustomer] = useState({ name: '', number: '', address: '', alternateNumber: '' });
  const [products, setProducts] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const salespersons = ['John Doe', 'Jane Smith', 'Tom Johnson'];
  const [finance, setFinance] = useState(false);  
  const [selectedFinancer, setSelectedFinancer] = useState('');
  const [downPayment, setDownPayment] = useState(0);
  const [tenure, setTenure] = useState(0);
  const [roi, setROI] = useState(0);
  const [discount, setDiscount] = useState(0);
  const financerOptions = ['Bajaj Finance', 'HDFC', 'ICICI', 'Axis Bank']; 
  const [advanceAmount, setAdvanceAmount] = useState(0); 
  const [paymentMode, setPaymentMode] = useState('cash');
  const [transactionId, setTransactionId] = useState('');
  const [splitPayment, setSplitPayment] = useState(false);
  const [secondAdvanceAmount, setSecondAdvanceAmount] = useState(0);
  const [secondPaymentMode, setSecondPaymentMode] = useState('cash');
  const [secondTransactionId, setSecondTransactionId] = useState('');
  const [financeTotal, setFinanceTotal] = useState();
  const totalAdvance = advanceAmount + secondAdvanceAmount

  const calculateAmount = () => {
    let totalAmount = 0;
    let totalGST = 0;
    products.forEach(product => {
      const price = product.customPrice || 0;
      const quantity = product.quantity || 1;
      const gst = product.gst || 0;  // Default to 0 if GST is not provided
      totalGST += (price * gst / 100) * quantity;
      totalAmount += price * quantity;
      
    });

    const totalWithGST = (totalAmount );
    return { totalAmount: totalAmount.toFixed(2) - totalGST.toFixed(2), totalGST, totalWithGST };
  };


  const { totalAmount, totalGST, totalWithGST } = calculateAmount();


useEffect(() => {

  const calculate = async () => {
    try {
      const result = await CalcultedFinance({
        product_rate: totalWithGST.toFixed(2),
        downpayment: downPayment,
        emiTenure: tenure,
        roi: roi,
        discount: discount || 0,
      });
      setFinanceTotal(result);
      console.log(result);
    } catch (err) {
      toast.error('Finance calculation failed');
    }
  };

  if (finance && downPayment && tenure && roi) {
    calculate();
  }
}, [finance,downPayment,tenure,roi,discount]);

console.log(downPayment)

  const handleCustomerChange = (field, value) => {
    setCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductChange = (index, fieldOrUpdatedProduct, value) => {
    setProducts(prev => {
      const updated = [...prev];
      if (typeof fieldOrUpdatedProduct === 'object') {
        updated[index] = fieldOrUpdatedProduct;
      } else {
        updated[index] = {
          ...updated[index],
          [fieldOrUpdatedProduct]: value
        };
      }
      return updated;
    });
  };

  const handleAddProduct = () => {
    setProducts(prev => [...prev, { isSearching: true, productName: '', quantity: 1, customPrice: 0, modelNumber: '' }]);
  };

  const handleRemoveProduct = (index) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeliveryDateChange = (date) => {
    setDeliveryDate(date);
  };

  const handleSalespersonChange = (person) => {
    setSalesperson(person);
  };

  const toggleFinance = () => {
    // If finance is being turned off, reset the finance-related states
    if (finance) {
      setSelectedFinancer('');
      setDownPayment('');
      setTenure('');
      setROI('');
      setDiscount('');
    }
    setFinance(!finance);
  };


  const handleGenerateBill = async () => {
    const payload = {
      formType,
      customerName: customer.name,
      customerAddress: customer.address,
      customerPhone: customer.number,
      customerAltPhone: customer.alternateNumber,
      products: products.map((product) => ({
        product_id: product.productId || "", 
        productNumber: product.productName || "",
        product_group: product.product_group || "",
        gst: product.gst || 0,
        quantity: product.quantity || 1,
        price: product.rate || 0,
        customPrice: product.customPrice || 0,
      })),
      totalAmount: parseFloat(totalWithGST),
      deliveryDate,
      salesperson,
      partialPayment: splitPayment,
      advanceAmount: totalAdvance,
      isFinance: finance,
      finance: finance
        ? {
            financerName: selectedFinancer,
            downpayment: parseFloat(downPayment) || 0,
            emiTenure: parseInt(tenure) || 0,
            roi: parseFloat(roi) || 0,
            discount: parseFloat(discount) || 0,
            priceAfterFinance: parseFloat(totalWithGST) - parseFloat(discount || 0),
          }
        : null,

          payment1: formType !== 'Estimate'?{
            amount: parseFloat(advanceAmount),
            mode: paymentMode,
            transactionId: transactionId,
          }:null,
          payment2: splitPayment?{
            amount: parseFloat(secondAdvanceAmount),
            mode: secondPaymentMode,
            transactionId: secondTransactionId,
          }:null
    };
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiServerUrl}/bill/create-bill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log(data)
      if(response.status <= 300
        ){
          toast.success('Bill created successfully!');
          if (formType === "Order Form") {
            navigate(`/customerOrder/${data.billId}`);
        } else {
          console.log("in else")
            navigate(`/customerOrder/${data.billId}`);
        }
        } else {
          throw new Error()
        }
     
      // Optionally redirect to invoice page
    } catch (error) {
      toast.error(`Bill generation failed. Please try again.`);
    }
    // navigate("/customerOrder/681cf6f78328a891a447c0fa");
  };
  
  const CalcultedFinance = async ({ product_rate, downpayment, emiTenure, roi, discount }) => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await axios.post(
        `${apiServerUrl}/finance/calculate`,
        {
          product_rate,
          downpayment,
          emiTenure,
          roi,
          discount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  let sum = (response.data.priceAfterFinance + downpayment)
      return sum; // contains calculated EMI and other values
    } catch (error) {
      console.error('Finance calculation failed:', error);
      throw error;
    }
  };



  
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-10 pb-5">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <div className="p-6">
          <h1 className="text-4xl font-bold p-5 text-[#0D8BC5] mb-6 text-center bg-gray-100">
            {formType}
          </h1>

          <div className="mb-6 flex gap-4 justify-center">
            {['Order Form', 'Invoice', 'Estimate'].map(type => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg text-sm font-medium border border-gray-100 ${formType === type ? 'bg-blue-300 text-gray-800' : 'bg-white text-gray-800'} shadow-md`}
                onClick={() => setFormType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="mb-5 text-right text-base font-medium text-[#0D8BC5] pr-2">
            Order Date: {new Date().toLocaleDateString()}
          </div>

          <CustomerDetail customer={customer} onChange={handleCustomerChange} />
          <ProductItemsSection
            products={products}
            onProductChange={handleProductChange}
            onAddProduct={handleAddProduct}
            onRemoveProduct={handleRemoveProduct}
          />
          <DeliveryDetailsForm
            deliveryDate={deliveryDate}
            salesperson={salesperson}
            salespersons={salespersons}
            onDeliveryDateChange={handleDeliveryDateChange}
            onSalespersonChange={handleSalespersonChange}
          />

          {/* Finance Toggle Section */}
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="partialToggle" className="font-medium text-[#1EA0DC]">
              Enable Finance Payment
            </label>

            <button
              id="partialToggle"
              onClick={toggleFinance}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 
        ${finance ? 'bg-[#1EA0DC]' : 'bg-gray-300'}`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 
          ${finance ? 'translate-x-7' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {/* Conditionally Render Finance Details Form */}
          {finance && (
            <div className="bg-gray-50 pl-4 pr-4 pb-4 rounded-lg">
              <h1 className="text-xl font-bold p-5 text-[#0D8BC5] mb-6 text-center">
                Add Finance Details
              </h1>
              <FinanceDetailsForm
                financerOptions={financerOptions}
                selectedFinancer={selectedFinancer}
                downPayment={downPayment}
                tenure={tenure}
                roi={roi}
                discount={discount}
                onFinancerChange={setSelectedFinancer}
                onDownPaymentChange={setDownPayment}
                onTenureChange={setTenure}
                onROIChange={setROI}
                onDiscountChange={setDiscount}
              />
            </div>
          )}

          {/* Include the Account Summary component */}
          <AccountSummary
            totalAmount={totalAmount}
            gstAmount={totalGST}
            totalWithGST={totalWithGST}
            advanceAmount={totalAdvance}
            financeTotal={financeTotal}
            downPayment={downPayment}
          />

{formType !== 'Estimate' && (
  <PaymentSection
    totalAmount={parseFloat(totalWithGST)}
    advanceAmount={advanceAmount}
    paymentMode={paymentMode}
    transactionId={transactionId}
    splitPayment={splitPayment}
    secondAdvanceAmount={secondAdvanceAmount}
    secondPaymentMode={secondPaymentMode}
    secondTransactionId={secondTransactionId}
    onAdvanceAmountChange={setAdvanceAmount}
    onPaymentModeChange={setPaymentMode}
    onTransactionIdChange={setTransactionId}
    onSplitPaymentToggle={setSplitPayment}
    onSecondAdvanceAmountChange={setSecondAdvanceAmount}
    onSecondPaymentModeChange={setSecondPaymentMode}
    onSecondTransactionIdChange={setSecondTransactionId}
  />
)}

        </div>

        <button
                    onClick={handleGenerateBill}
                    className="w-full bg-[#149cd9] text-white text-xl font-extrabold py-3 rounded-lg hover:bg-[#5ab7e0]"
                >
                    Generate Bill
                </button>
      </div>
    </div>
  );
};

export default CartPage;

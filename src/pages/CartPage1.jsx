import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiServerUrl } from '../constant/constants';
import PaymentSection from '../components/PaymentSection';

const salespersons = ['John Doe', 'Jane Smith', 'Mike Johnson'];
const paymentModes = ['Cash', 'Online', 'Card'];

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formType, setFormType] = useState('Order Form');
    const [customer, setCustomer] = useState({ name: '', number: '', address: '', alternateNumber: '' });
    const [products, setProducts] = useState([]);
    const [searchModel, setSearchModel] = useState({});
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [transactionId, setTransactionId] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [salesperson, setSalesperson] = useState('');
    const [partialPayment, setPartialPayment] = useState(false);
    const [advanceAmount, setAdvanceAmount] = useState(0);
    const [splitPayment, setSplitPayment] = useState(false);

    const [paymentMode1, setPaymentMode1] = useState('');
    const [paymentAmount1, setPaymentAmount1] = useState('');
    const [transactionId1, setTransactionId1] = useState('');

    const [paymentMode2, setPaymentMode2] = useState('');
    const [paymentAmount2, setPaymentAmount2] = useState('');
    const [transactionId2, setTransactionId2] = useState('');

    const [totalGst , setTotalGst] = useState(0);
    const [grandTotalAmount , setGrandTotalAmount] = useState(0);

    const token = localStorage.getItem('token');


    useEffect(() => {
        const totalGST = getTotalGST();
        const grandTotal = getTotalSelling() + totalGST;
    
        setTotalGst(totalGST);
        setGrandTotalAmount(grandTotal);
    }, [products]);
    
    const handleAddProduct = () => {
        setProducts([...products, { modelNumber: '', quantity: 1, price: 0, customPrice: 0, image: '', description: "", productName: '' }]);
    };

    const handleRemoveProduct = (index) => {
        const updated = [...products];
        updated.splice(index, 1);
        setProducts(updated);
    };

    const handleProductChange = (index, field, value) => {
        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);
    };

    const getTotalGST = () => {
        let totalGST = 0;
        products.forEach((product) => {

            const price = product.customPrice || 0; 
            const gstRate = product.gst || 0;
            totalGST += (price * gstRate) / 100;
            console.log({price,gstRate,totalGST})
        
        });
       
        return totalGST;
    };

    const getGrandTotal = () => {
        
        return getTotalSelling() + getTotalGST();
    };

    const handleSearchModel = async (index, value) => {
        handleProductChange(index, 'modelNumber', value);

        try {
            const res = await axios.get(`${apiServerUrl}/stocks/searchStock?search=${value}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSearchModel(prev => ({ ...prev, [index]: res.data }));
        } catch (err) {
            toast.error(err.message)
        }
    };

    const selectProduct = (index, product) => {
        const updated = [...products];
        updated[index] = {
            modelNumber: product.productNumber,
            quantity: 1,
            price: product.mrp,
            customPrice: product.offer_price,
            image: product.image,
            description: product.description,
            productName: product.productNumber,
            gst: product.gst,
            product_group: product.product_group
        };
        setProducts(updated);
        setSearchModel(prev => ({ ...prev, [index]: [] }));
    };

    const handleGenerateBill = async () => {
        const totalAmount = products.reduce(
            (acc, item) => acc + item.customPrice * item.quantity,
            0
        );

        const formattedProducts = products.map((item) => ({
            productNumber: item.modelNumber,
            product_group: item.product_group,
            gst: item.gst,
            quantity: item.quantity,
            price: item.price,
            customPrice: item.customPrice,
            image: item.image,
            description: item.description,
        }));

        const billPayload = {
            formType: formType,
            customerName: customer.name,
            customerAddress: customer.address,
            customerPhone: customer.number,
            customerAltPhone: customer.alternateNumber,
            products: formattedProducts,
            totalAmount,
            grandTotalAmount,
            totalGst,
            paymentMethod: splitPayment ? "Split" : paymentMode,
            transactionId: !splitPayment && paymentMode !== "Cash" ? transactionId : "",
            deliveryDate: new Date(deliveryDate), 
            salesperson,
            partialPayment,
            advanceAmount,
            splitPayment,
            payment1: splitPayment
                ? {
                    mode: paymentMode1,
                    amount: Number(paymentAmount1),
                    transactionId:
                        paymentMode1 === "Online" || paymentMode1 === "Card"
                            ? transactionId1
                            : "",
                }
                : null,
            payment2: splitPayment
                ? {
                    mode: paymentMode2,
                    amount: Number(paymentAmount2),
                    transactionId:
                        paymentMode2 === "Online" || paymentMode2 === "Card"
                            ? transactionId2
                            : "",
                }
                : null,
        };

        try {
            const response = await fetch("http://localhost:3000/bill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer ${token}`,
                },
                body: JSON.stringify(billPayload),
            });

            const data = await response.json();

            if (response.ok) {
                // include returned _id in orderBillData
                const orderBillData = {
                    ...billPayload,
                    createdAt: new Date().toISOString(),
                    _id: data._id, // received from backend
                };
                console.log(formType)
                if (formType === "Order Form") {
                    navigate("/customerOrder", { state: orderBillData });
                } else {
                    navigate("/orderbill", { state: orderBillData });
                }

            } else {
                toast.error("Bill creation failed:");
            }
        } catch (error) {
            toast.error("Error creating bill:", error.message);
        }
    };

    const getTotalMRP = () => {
        return products.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);
    };

    const getTotalSelling = () => {
        return products.reduce((sum, p) => sum + (p.customPrice * (p.quantity || 1)), 0);
    };

    return (
        <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-10 pb-5">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-4xl font-bold p-5  text-[#0D8BC5] mb-6 text-center bg-gray-100">
                    {formType}
                </h1>


                {/* Order Type Tabs */}
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
                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div>
                        <label htmlFor="customerName" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
                            Customer Name 
                        </label>
                        <input
                            id="customerName"
                            type="text"
                            placeholder="Customer Name"
                            className="input-style"
                            value={customer.name}
                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
                            Phone Number
                        </label>
                        <input
                            id="phoneNumber"
                            type="text"
                            placeholder="Phone Number"
                            className="input-style"
                            value={customer.number}
                            onChange={(e) => setCustomer({ ...customer, number: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="altNumber" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
                            Alternate Number
                        </label>
                        <input
                            id="altNumber"
                            type="text"
                            placeholder="Alternate Number (Optional)"
                            className="input-style"
                            value={customer.alternateNumber}
                            onChange={(e) => setCustomer({ ...customer, alternateNumber: e.target.value })}
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="address" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
                            Address
                        </label>
                        <input
                            id="address"
                            type="text"
                            placeholder="Address"
                            className="input-style"
                            value={customer.address}
                            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        />
                    </div>

                </div>
                {/* Product Section */}
                <div className="p-6">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl text-[#1EA0DC] font-semibold">Item Details</h2>
                            <button onClick={handleAddProduct} className="bg-[#0D8BC5] text-white px-4 py-2 rounded-full shadow-xl hover:bg-[#1EA0DC]">
                                Add Items
                            </button>
                        </div>

                        {products.map((product, index) => (
                            <div key={index} className="relative bg-gray-50 rounded-lg p-4 mb-5 shadow-sm">
                                <button
                                    onClick={() => handleRemoveProduct(index)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                >
                                    ✕
                                </button>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                    {/* Left side: Search or Product Info */}
                                    <div className="flex items-start sm:items-center w-full">
                                        {!product.productName ? (
                                            <div className="relative w-full">
                                                <label htmlFor={`modelNumber-${index}`} className="text-sm font-medium text-[#1EA0DC] mb-1 block">
                                                    Enter Model Number / Product Name
                                                </label>
                                                <input
                                                    id={`modelNumber-${index}`}
                                                    type="text"
                                                    className="input-style w-full"
                                                    placeholder="Model Number / Product Name"
                                                    value={product.modelNumber}
                                                    onChange={(e) => handleSearchModel(index, e.target.value)}
                                                />
                                                {searchModel[index]?.length > 0 && (
                                                    <div className="absolute bg-white border w-full z-10 max-h-40 overflow-y-auto">
                                                        {searchModel[index].map((p) => (
                                                            <div
                                                                key={p._id}
                                                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                                                onClick={() => selectProduct(index, p)}
                                                            >
                                                                {p.productNumber}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-start sm:items-center">
                                                {product.image && (
                                                    <img
                                                        src={product.image}
                                                        alt="product"
                                                        className="w-24 h-24 rounded object-cover mb-2 mr-4"
                                                    />
                                                )}
                                                <div className="flex flex-col">
                                                    <div className="text-xl font-medium text-gray-900">
                                                        {product.productName}
                                                    </div>
                                                    {/* <div className="text-sm text-gray-900 mt-1">
                                                        MRP: ₹{product.price}
                                                    </div> */}
                                                    {/* <div className="text-xs text-gray-500 mt-1">
                                                        {product.description?.length > 30
                                                            ? product.description.slice(0, 30) + '...'
                                                            : product.description}
                                                    </div> */}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right side: Inputs aligned in a row */}
                                    {product.productName && (
                                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
                                            <div className="flex flex-col">
                                                <label htmlFor={`quantity-${index}`} className="text-sm text-[#1EA0DC] font-semibold mb-1">
                                                    Quantity
                                                </label>
                                                <input
                                                    id={`quantity-${index}`}
                                                    type="number"
                                                    className="input-style w-32"
                                                    placeholder="Quantity"
                                                    value={product.quantity}
                                                    onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <label htmlFor={`customPrice-${index}`} className="text-sm text-[#1EA0DC] font-semibold mb-1">
                                                    Selling Price
                                                </label>
                                                <input
                                                    id={`customPrice-${index}`}
                                                    type="number"
                                                    className="input-style w-32"
                                                    placeholder="Selling Price"
                                                    value={product.customPrice}
                                                    onChange={(e) => handleProductChange(index, 'customPrice', Number(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery & Salesperson */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <div>
                        <label htmlFor="address" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
                            Delivery Date
                        </label>
                        <input type="date" className="input-style text-gray-500" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="address" className="text-sm font-medium text-[#1EA0DC] mb-1 block">
                            Sales Person
                        </label>
                        <select className="input-style text-gray-500" value={salesperson} onChange={(e) => setSalesperson(e.target.value)}>
                            <option value="" >Select Salesperson</option>
                            {salespersons.map(person => <option key={person}>{person}</option>)}
                        </select>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="mb-8">
                    {formType !== 'Estimate' && (
                        <div className="flex items-center justify-between mb-4">
                            <label htmlFor="partialToggle" className="font-medium text-[#1EA0DC]">
                                Enable Partial Payment
                            </label>

                            <button
                                id="partialToggle"
                                onClick={() => setPartialPayment(!partialPayment)}
                                className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 
        ${partialPayment ? 'bg-[#1EA0DC]' : 'bg-gray-300'}`}
                            >
                                <div
                                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 
          ${partialPayment ? 'translate-x-7' : 'translate-x-0'}`}
                                />
                            </button>
                        </div>
                    )}

                    {formType !== 'Estimate' && partialPayment && (
                        <input
                            type="number"
                            placeholder="Enter Advance Payment"
                            className="input-style mb-4"
                            value={advanceAmount}
                            onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                        />
                    )}

     

                    <div className="text-sm space-y-1 bg-[#dcf2fc] bg-opacit p-4 rounded mt-4">
                        <div><strong>Total MRP:</strong> ₹{getTotalMRP()}</div>
                        <div><strong>Total Selling Price (Without GST):</strong> ₹{getTotalSelling()}</div>

                   
                        <div><strong>Total GST:</strong> ₹{getTotalGST().toFixed(2)}</div>
                        <div className="text-lg font-bold"><strong>Grand Total (Including GST):</strong> ₹{getGrandTotal().toFixed(2)}</div>

                        {partialPayment && (
                            <>
                                <div><strong>Advance Paid:</strong> ₹{advanceAmount}</div>
                                <div><strong>Due Amount:</strong> ₹{Math.max(getGrandTotal() - advanceAmount, 0).toFixed(2)}</div>
                            </>
                        )}
                    </div>

                </div>

                {formType !== 'Estimate' && (
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-[#1EA0DC] mb-4">Payment Mode</h3>

                       
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-medium">Enable Split Payment</span>
                            <button
                                id="partialToggle"
                                onClick={() => setSplitPayment(!splitPayment)}
                                className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 
        ${splitPayment ? 'bg-[#1EA0DC]' : 'bg-gray-300'}`}
                            >
                                <div
                                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 
          ${splitPayment ? 'translate-x-7' : 'translate-x-0'}`}
                                />
                            </button>
                        </div>

                        
                        <div className="mb-4">
                            <p className="font-semibold mb-2">Payment Method 1</p>
                            <div className="flex gap-4 mb-2">
                                {paymentModes.map((mode) => (
                                    <label key={mode} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="paymentMode1"
                                            value={mode}
                                            checked={paymentMode1 === mode}
                                            onChange={() => setPaymentMode1(mode)}
                                        />
                                        {mode}
                                    </label>
                                ))}
                            </div>

                            <input
                                type="number"
                                placeholder="Amount"
                                className="input-style mb-2"
                                value={paymentAmount1}
                                onChange={(e) => setPaymentAmount1(e.target.value)}
                            />

                            {(paymentMode1 === 'Online' || paymentMode1 === 'Card') && (
                                <input
                                    type="text"
                                    placeholder="Transaction ID"
                                    className="input-style mb-4"
                                    value={transactionId1}
                                    onChange={(e) => setTransactionId1(e.target.value)}
                                />
                            )}
                        </div>

                       
                        {splitPayment && (
                            <div className="mb-4">
                                <p className="font-semibold mb-2">Payment Method 2</p>
                                <div className="flex gap-4 mb-2">
                                    {paymentModes.map((mode) => (
                                        <label key={mode + '2'} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="paymentMode2"
                                                value={mode}
                                                checked={paymentMode2 === mode}
                                                onChange={() => setPaymentMode2(mode)}
                                            />
                                            {mode}
                                        </label>
                                    ))}
                                </div>

                                <input
                                    type="number"
                                    placeholder="Amount"
                                    className="input-style mb-2"
                                    value={paymentAmount2}
                                    onChange={(e) => setPaymentAmount2(e.target.value)}
                                />

                                {(paymentMode2 === 'Online' || paymentMode2 === 'Card') && (
                                    <input
                                        type="text"
                                        placeholder="Transaction ID"
                                        className="input-style mb-4"
                                        value={transactionId2}
                                        onChange={(e) => setTransactionId2(e.target.value)}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
{/* <PaymentSection /> */}

                {/* Generate Bill */}
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
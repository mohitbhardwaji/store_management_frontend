import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const salespersons = ['John Doe', 'Jane Smith', 'Mike Johnson'];
const paymentModes = ['Cash', 'Online', 'Card'];

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formType, setFormType] = useState('Order Form');
    const [customer, setCustomer] = useState({ name: '', number: '', address: '', alternateNumber: '' });
    const [products, setProducts] = useState([]);
    const [searchModel, setSearchModel] = useState({});
    const [allProducts, setAllProducts] = useState([]);
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [transactionId, setTransactionId] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [salesperson, setSalesperson] = useState('');

    const token = localStorage.getItem('token');

    const handleAddProduct = () => {
        setProducts([...products, { modelNumber: '', quantity: 1, price: 0, customPrice: 0, image: '' ,description:"", productName:''}]);
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

    const handleSearchModel = async (index, value) => {
        handleProductChange(index, 'modelNumber', value);

        try {
            const res = await axios.get(`http://localhost:3000/stocks/getstock?search=${value}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSearchModel(prev => ({ ...prev, [index]: res.data }));
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    const selectProduct = (index, product) => {
        const updated = [...products];
        updated[index] = {
            modelNumber: product.model_number,
            quantity: 1,
            price: product.mrp,
            customPrice: product.selling_price,
            image: product.image_url,
            description:product.product_description,
            productName:product.product_name
        };
        setProducts(updated);
        setSearchModel(prev => ({ ...prev, [index]: [] }));
    };

    const handleGenerateBill = () => {
        const totalAmount = products.reduce(
          (acc, item) => acc + item.customPrice * item.quantity,
          0
        );
      
        const orderBillData = {
          formType,
          customerName: customer.name,
          customerAddress: customer.address,
          customerPhone: customer.number,
          customerAltPhone:customer.alternateNumber,
          products,
          totalAmount,
          paymentMethod: paymentMode,
          transactionId: paymentMode !== 'Cash' ? transactionId : '',
          deliveryDate,
          salesperson,
          createdAt: new Date().toISOString(),
          _id: `ORDER-${Date.now()}`, // temporary unique ID
        };
      
        navigate('/orderbill', { state: orderBillData });
      };
      

    return (
        <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-10 pb-5">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold mb-6">Create {formType}</h1>

                {/* Order Type Tabs */}
                <div className="mb-6 flex gap-4">
                    {['Order Form', 'Estimate'].map(type => (
                        <button
                            key={type}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border ${formType === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} shadow`}
                            onClick={() => setFormType(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Customer Name"
                        className="input-style"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        className="input-style"
                        value={customer.number}
                        onChange={(e) => setCustomer({ ...customer, number: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Alternate Number (Optional)"
                        className="input-style"
                        value={customer.alternateNumber}
                        onChange={(e) => setCustomer({ ...customer, alternateNumber: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="input-style sm:col-span-3"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    />
                </div>


                {/* Product Section */}
                <div className="p-6">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Product Details</h2>
                            <button onClick={handleAddProduct} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">Add Product</button>
                        </div>

                        {products.map((product, index) => (
                            <div className="relative bg-gray-50 rounded-lg p-4 mb-5 shadow-sm">
  <button
    onClick={() => handleRemoveProduct(index)}
    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
  >
    ✕
  </button>

  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
    {/* Left side: Image + Info */}
    <div className="flex items-start sm:items-center">
      {product.image && (
        <img
          src={product.image}
          alt="product"
          className="w-24 h-24 rounded object-cover mb-2 mr-4"
        />
      )}
      <div className="flex flex-col">
        {/* Model Number or Search */}
        {product.image ? (
          <div className="text-xl font-medium text-gray-900">
            {product.productName}
          </div>
        ) : (
          <div className="relative">
            <input
              id={`modelNumber-${index}`}
              type="text"
              className="input-style"
              placeholder="Search Model Number"
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
                    {p.model_number} - {p.product_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Name and Description */}
        {/* <div className="text-sm font-semibold text-gray-900">{product.productName}</div> */}
        <div className="text-sm  text-gray-900 mt-1">
          MRP: ₹{product.price}
        </div>
        <div className="text-xs text-gray-500 mt-1">
  {product.description?.length > 30 ? product.description.slice(0, 30) + '...' : product.description}
</div>

      </div>
    </div>

    {/* Right side: Inputs aligned in a row */}
    <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
      <div className="flex flex-col">
        <label htmlFor={`quantity-${index}`} className="text-sm font-semibold mb-1">
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
        <label htmlFor={`customPrice-${index}`} className="text-sm font-semibold mb-1">
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
  </div>
</div>

                        ))}
                    </div>
                </div>
                {/* Delivery & Salesperson */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <input type="date" className="input-style" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                    <select className="input-style" value={salesperson} onChange={(e) => setSalesperson(e.target.value)}>
                        <option value="">Select Salesperson</option>
                        {salespersons.map(person => <option key={person}>{person}</option>)}
                    </select>
                </div>

                {/* Payment Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium mb-2">Payment Mode</h3>
                    <div className="flex gap-4 mb-4">
                        {paymentModes.map(mode => (
                            <label key={mode} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="paymentMode"
                                    value={mode}
                                    checked={paymentMode === mode}
                                    onChange={() => setPaymentMode(mode)}
                                />
                                {mode}
                            </label>
                        ))}
                    </div>
                    {(paymentMode === 'Online' || paymentMode === 'Card') && (
                        <input
                            type="text"
                            placeholder="Transaction ID"
                            className="input-style"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                        />
                    )}
                </div>

                {/* Generate Bill */}
                <button
                    onClick={handleGenerateBill}
                    className="w-full bg-green-600 text-white text-lg py-3 rounded-lg hover:bg-green-700"
                >
                    Generate Bill
                </button>
            </div>
        </div>
    );
};

export default CartPage;

// Tailwind helper
// Add to global CSS or use inline: input-style: 'border rounded px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

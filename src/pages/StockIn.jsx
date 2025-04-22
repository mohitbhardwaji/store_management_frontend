import { useState } from 'react';
import axios from 'axios';

export default function AddStockPage() {
  const [formData, setFormData] = useState({
    product_name: '',
    model_number: '',
    company: '',
    stock_in_date: '',
    quantity: '',
    product_description: '',
    selling_price: '',
    mrp: '',
    cost_price: '',
    discount: '',
    batch_no: '',
    status: true,
    image_url: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/stocks/addstock', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Stock added successfully!');
      setFormData({
        product_name: '',
        model_number: '',
        company: '',
        stock_in_date: '',
        quantity: '',
        product_description: '',
        selling_price: '',
        mrp: '',
        cost_price: '',
        discount: '',
        batch_no: '',
        status: true,
        image_url: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error adding stock!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">Add New Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="product_name" label="Product Name" value={formData.product_name} onChange={handleChange} />
          <Input name="model_number" label="Model Number" value={formData.model_number} onChange={handleChange} />
          <Input name="company" label="Company" value={formData.company} onChange={handleChange} />
          <Input type="date" name="stock_in_date" label="Stock In Date" value={formData.stock_in_date} onChange={handleChange} />
          <Input name="quantity" label="Quantity" type="number" value={formData.quantity} onChange={handleChange} />
          <Input name="selling_price" label="Selling Price" type="number" value={formData.selling_price} onChange={handleChange} />
          <Input name="mrp" label="MRP" type="number" value={formData.mrp} onChange={handleChange} />
          <Input name="cost_price" label="Cost Price" type="number" value={formData.cost_price} onChange={handleChange} />
          {/* <Input name="discount" label="Discount (%)" type="number" value={formData.discount} onChange={handleChange} /> */}
          <Input name="batch_no" label="Batch No" value={formData.batch_no} onChange={handleChange} />
          <Input name="image_url" label="Image URL" value={formData.image_url} onChange={handleChange} />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
            <span className="text-sm text-gray-700">Available in stock</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
          <textarea
            name="product_description"
            value={formData.product_description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Stock
        </button>
      </form>
    </div>
  );
}

function Input({ name, label, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}

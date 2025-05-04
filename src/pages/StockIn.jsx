import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiServerUrl } from '../constant/constants';

export default function AddStockPage() {
  const [formData, setFormData] = useState({
    productNumber: '',
    product_group: '',
    unit: '',
    unit_type: '',
    gst: '',
    batch: '',
    description: '',
    vendor: '',
    mrp: '',
    offer_price: '',
    selling_price: '',
    cost_price: '',
    stock_in_date: '',
    category: ''
  });

  const [dropdowns, setDropdowns] = useState({
    unit_type: [],
    vendor: [],
    gst: [],
    category: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiServerUrl}/stocks/addstock`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Stock added successfully!');
      setFormData({
        productNumber: '',
        product_group: '',
        unit: '',
        unit_type: '',
        gst: '',
        batch: '',
        description: '',
        vendor: '',
        mrp: '',
        offer_price: '',
        selling_price: '',
        cost_price: '',
        stock_in_date: '',
        category: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error adding stock!');
    }
  };

  const fetchDropdownValues = async (key) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiServerUrl}/core/dropdown/${key}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data?.value || [];
    } catch (err) {
      console.error(`Error loading dropdown for key: ${key}`, err);
      return [];
    }
  };

  useEffect(() => {
    const loadDropdowns = async () => {
      const [unitTypes, vendors, gstValues, category] = await Promise.all([
        fetchDropdownValues('unit_type'),
        fetchDropdownValues('vendor'),
        fetchDropdownValues('gst'),
        fetchDropdownValues('category'),
      ]);

      setDropdowns({
        unit_type: unitTypes,
        vendor: vendors,
        gst: gstValues,
        category: category,
      });
    };

    loadDropdowns();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#0D8BC5] text-center p-5 bg-gray-100">Add New Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="productNumber" label="Product Number" value={formData.productNumber} onChange={handleChange} />
          <Input name="product_group" label="Product Group" value={formData.product_group} onChange={handleChange} />
          <Input name="unit" label="Unit" type="number" value={formData.unit} onChange={handleChange} />
          <Select name="unit_type" label="Unit Type" value={formData.unit_type} onChange={handleChange} options={dropdowns.unit_type} />
          <Select name="gst" label="GST (%)" value={formData.gst} onChange={handleChange} options={dropdowns.gst} />
          <Input name="mrp" label="MRP" type="number" value={formData.mrp} onChange={handleChange} />
          <Input name="offer_price" label="Offer Price" type="number" value={formData.offer_price} onChange={handleChange} />
          <Input name="selling_price" label="Selling Price" type="number" value={formData.selling_price} onChange={handleChange} required={false}/>
          <Input name="cost_price" label="Cost Price" type="number" value={formData.cost_price} onChange={handleChange} />
          <Input name="stock_in_date" label="Stock In Date" type="date" value={formData.stock_in_date} onChange={handleChange} />
          <Input name="batch" label="Batch No" value={formData.batch} onChange={handleChange} required={false} />
          <Select name="vendor" label="Vendor" value={formData.vendor} onChange={handleChange} options={dropdowns.vendor} required={false} />
          <Select name="category" label="Product Category" value={formData.category} onChange={handleChange} options={dropdowns.category} required={false} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1EA0DC] mb-1">
            Description <span className="text-gray-400 text-sm">(optional)</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="bg-[#149cd9] text-white font-bold px-6 py-2 rounded-md hover:bg-[#5ab7e0] transition"
        >
          Add Stock
        </button>
      </form>
    </div>
  );
}

// Reusable Input component
function Input({ name, label, type = 'text', value, onChange, required = true }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1EA0DC] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md text-gray-500"
      />
    </div>
  );
}

// Reusable Select component
function Select({ name, label, value, onChange, options = [], required = true }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1EA0DC] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md text-gray-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

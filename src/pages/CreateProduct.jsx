import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { apiServerUrl } from '../constant/constants';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productNumber: '',
    category: '',
    subcategory: '',
    rate: '',
    gst: '',
    cost_price: '', 
  });

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiServerUrl}/products/create-product`, product, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Product created successfully!');
      navigate('/products');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create product.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-[#0D8BC5]">Create Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Product Number</label>
          <input
            type="text"
            name="productNumber"
            value={product.productNumber}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Subcategory</label>
          <input
            type="text"
            name="subcategory"
            value={product.subcategory}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Rate</label>
          <input
            type="number"
            name="rate"
            value={product.rate}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Cost Price</label>
          <input
            type="number"
            name="cost_price"
            value={product.cost_price}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">GST (%)</label>
          <input
            type="number"
            name="gst"
            value={product.gst}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mt-4"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;

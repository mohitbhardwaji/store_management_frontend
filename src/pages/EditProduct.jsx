import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast
import { apiServerUrl } from '../constant/constants';

export default function EditProduct() {
  const { id } = useParams(); // 👈 Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${apiServerUrl}/stocks/getstock?id=${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProduct(res.data.product);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${apiServerUrl}stocks/updatestock?id=${id}`, product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Product updated successfully!'); // Show success toast
      navigate('/products'); // Redirect to products page after success
    } catch (err) {
      console.error(err);
      toast.error('Failed to update product.'); // Show error toast
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-[#0D8BC5]">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Product Number</label>
          <input
            type="text"
            name="productNumber"
            value={product.productNumber}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
            disabled
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input
            type="text"
            name="product_group"
            value={product.product_group}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Unit</label>
          <input
            type="number"
            name="unit"
            value={product.unit}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Unit Type</label>
          <input
            type="text"
            name="unit_type"
            value={product.unit_type}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">GST %</label>
          <input
            type="number"
            name="gst"
            value={product.gst}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Batch</label>
          <input
            type="text"
            name="batch"
            value={product.batch}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Vendor</label>
          <input
            type="text"
            name="vendor"
            value={product.vendor}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">MRP</label>
          <input
            type="number"
            name="mrp"
            value={product.mrp}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Offer Price</label>
          <input
            type="number"
            name="offer_price"
            value={product.offer_price}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Selling Price</label>
          <input
            type="number"
            name="selling_price"
            value={product.selling_price}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
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
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Stock-in Date</label>
          <input
            type="date"
            name="stock_in_date"
            value={product.stock_in_date}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

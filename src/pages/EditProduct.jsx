import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { apiServerUrl } from '../constant/constants';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    category: '',
    subcategory: '',
    rate: '',
    gst: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${apiServerUrl}/products/get-product/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setProduct({
          category: res.data.category || '',
          subcategory: res.data.subcategory || '',
          rate: res.data.rate || '',
          gst: res.data.gst || '',
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
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
      await axios.put(`${apiServerUrl}/products/update-product/${id}`, product, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Product updated successfully!');
      navigate('/products');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update product.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-[#0D8BC5]">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
            
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
           
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Rate</label>
          <input
            type="text"
            name="rate"
            value={product.rate}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleInputChange({
                  target: {
                    name: 'rate',
                    value: value === '' ? '' : Number(value),
                  },
                });
              }
            }}
            className="w-full border rounded px-4 py-2"
           
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">GST (%)</label>
          <input
            type="text"
            name="gst"
            value={product.gst}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleInputChange({
                  target: {
                    name: 'gst',
                    value: value === '' ? '' : Number(value),
                  },
                });
              }
            }}
            className="w-full border rounded px-4 py-2"
            
          />

        </div>
        <button
          type="submit"
          className="bg-[#0D8BC5] hover:bg-[#0b7ab0] text-white px-6 py-2 rounded mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

import { useEffect, useState } from 'react';
import axios from 'axios';
import CartButton from '../components/CartButton';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch products from the API
    axios
      .get('http://localhost:3000/stocks/getstock', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setProducts(res.data)) // Set the stock data to state
      .catch(() => setError('Failed to load products.'));
  }, []);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login first!');

    const cartItem = {
      productId: `p${product._id}`, // Use product _id from API response
      name: product.product_name,   // Use product_name from API response
      price: product.selling_price, // Use selling_price from API response
      quantity: 1,
      image: product.image_url,     // Use image_url from API response
    };

    try {
      await axios.post('http://localhost:3000/cart', cartItem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(addToCart(cartItem)); // ✅ update Redux
    } catch (error) {
      console.error(error);
      alert('Failed to add to cart.');
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Products</h1>
        <CartButton />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow rounded-xl p-4">
            <img
              src={product.image_url}
              alt={product.product_name}
              className="h-40 object-cover w-full mb-2 rounded"
            />
            <h2 className="text-lg font-bold">{product.product_name}</h2>
            <p className="text-gray-700">Rs. {product.mrp}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

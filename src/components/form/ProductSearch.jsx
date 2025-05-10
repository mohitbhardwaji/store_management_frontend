import React, { useState, useEffect } from 'react';
import { apiServerUrl } from '../../constant/constants';

const ProductSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (searchTerm) => {
    if (!searchTerm) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiServerUrl}/stocks/searchStock?search=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setResults(data); // Expects array from API
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(query);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Product"
        className="w-full border border-gray-300 rounded-md p-2"
      />
      {loading && <div className="text-sm text-gray-500 mt-1">Loading...</div>}
      {!loading && results.length > 0 && (
        <ul className="absolute z-10 bg-white w-full border mt-1 rounded shadow max-h-52 overflow-y-auto">
          {results.map((stockItem) => (
            <li
              key={stockItem._id}
              onClick={() => {
                onSelect({
                  productName: stockItem.product.productNumber,
                  productId: stockItem.product._id,
                  rate: stockItem.product.rate,
                  stockId: stockItem._id,
                  currentStock: stockItem.current_quantity,
                  gst:stockItem.product.gst
                });
                setQuery('');
                setResults([]);
              }}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {stockItem.product.productNumber}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductSearch;

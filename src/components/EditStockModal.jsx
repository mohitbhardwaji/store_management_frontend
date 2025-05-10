import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { apiServerUrl } from '../constant/constants';

export default function EditStockModal({ isOpen, onClose, product, onUpdate }) {
  const [quantity, setQuantity] = useState('');
  const [vendor, setVendor] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(product.currentStock);
      setVendor(product.vendor);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiServerUrl}/stocks/update-stock/${product.stockId}`, {
        current_quantity: Number(quantity),
        vendor,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      toast.success('Stock updated successfully!');
      onUpdate(); // Refresh product list
      onClose(); // Close modal
    } catch (error) {
      toast.error('Failed to update stock.');
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Stock</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Vendor</label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Current Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

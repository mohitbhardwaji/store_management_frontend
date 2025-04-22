// src/components/CartButton.jsx
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function CartButton() {
  const items = useSelector((state) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      to="/cart"
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
    >
      🛒 Cart ({totalCount})
    </Link>
  );
}

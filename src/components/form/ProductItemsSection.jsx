import React from 'react';
import ProductSearch from './ProductSearch';

const ProductItemsSection = ({ products, onProductChange, onAddProduct, onRemoveProduct }) => {
  return (
    <div className="p-4 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-[#0D8BC5]">Products</h2>
        <button
          type="button"
          onClick={onAddProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow"
        >
          + Add Product
        </button>
      </div>

      {products.map((product, index) => (
        <div key={index} className="relative rounded-lg p-4 mb-4 shadow-sm bg-gray-50">
          {/* Remove (✕) button */}
          <button
            onClick={() => onRemoveProduct(index)}
            className="absolute -top-3 -right-3 bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-500"
            aria-label="Remove product"
          >
            ✕
          </button>

          {product.isSearching ? (
            <ProductSearch
              onSelect={(selectedProduct) =>
                onProductChange(index, {
                  ...selectedProduct,
                  isSearching: false,
                  quantity: 1,
                  customPrice: selectedProduct.price || selectedProduct.rate, // Default to price or rate from search result
                })
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Left: Product name */}
              <div>
                <span className="font-semibold text-gray-800">{product.productName}</span>
              </div>

              {/* Right: Quantity & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="text"
                    value={product.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only digits
                      if (/^\d*$/.test(value)) {
                        onProductChange(index, 'quantity', value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      onProductChange(index, 'quantity', value === '' ? 0 : parseInt(value));
                    }}
                    className="w-full border border-gray-300 rounded p-2"
                  />

                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="text"
                    value={product.customPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only valid float input
                      if (/^\d*\.?\d*$/.test(value)) {
                        onProductChange(index, 'customPrice', value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      onProductChange(index, 'customPrice', value === '' ? 0 : parseFloat(value));
                    }}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductItemsSection;

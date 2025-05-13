import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiEye, FiPlus } from 'react-icons/fi';
import { FaSearch, FaUpload } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { GoUpload } from "react-icons/go";
import { toast } from 'react-toastify';
import ExcelUploadModal from '../components/FileUpload';
import Loader from '../components/Loader';
import { apiServerUrl } from '../constant/constants';
import EditStockModal from '../components/EditStockModal';




export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const windowSize = 5; // window size of page numbers visible at once
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async (search = '', page = 1) => {
    try {

      const delay = new Promise((resolve) => setTimeout(resolve, 100)); // 1.5 sec delay

      const request = await axios.get(`${apiServerUrl}/stocks/getstock`, {
        params: {
          search,
          page,
          limit: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const [res] = await Promise.all([request, delay]);
      console.log(res.data.data)
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Token Expired please login again');
        navigate('/login');
      } else {
        toast.error('Failed to load products.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleEdit = (productId) => {
    console.log(productId)
    navigate(`/edit_product/${productId}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate start and end page for window
  const getPageWindow = () => {
    const halfWindow = Math.floor(windowSize / 2);
    let start = Math.max(1, currentPage - halfWindow);
    let end = start + windowSize - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - windowSize + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleAddNewStock = () => {
    navigate('/createproduct'); // Navigate to the Add New Stock page
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleFileUpload = async (file, uploadDate) => {
    if (!file || !uploadDate) {
      toast.error('Please select a file and date.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('stock_date', uploadDate.toLocaleDateString('en-US')); // format: MM/DD/YYYY

    try {
      const res = await axios.post(`${apiServerUrl}/stocks/importStock`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success(res.data?.message || 'Stock imported successfully!');
      fetchProducts(searchQuery, currentPage); // Refresh product list
      setIsUploadModalOpen(false); // Close modal
    } catch (error) {
      console.error('Upload Error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to upload stock.');
      }
    }
  };


  const handleOpenEditModal = (product) => {
    console.log(product)
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedProduct(null);
    setEditModalOpen(false);
  };

  const handleUpdateSuccess = () => {
    fetchProducts(searchQuery, currentPage);
  };

  if (loading) return (
    <div className='flex items-center justify-center min-h-screen' >
      <Loader />
    </div>

  );

  return (
    <div className="p-4 bg-white rounded-xl relative">
      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onFileUpload={handleFileUpload}
      />
 <EditStockModal
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        product={selectedProduct}
        onUpdate={handleUpdateSuccess}
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl text-[#0D8BC5] font-bold">Inventory Management</h1>

        {/* Search */}
        <div className="flex w-full md:w-auto items-center border border-gray-300 rounded-xl gap-2 px-3 shadow-lg">
          <input
            type="text"
            placeholder="Search Product Number"
            value={searchQuery}
            onChange={handleSearch}
            className="flex-1 px-4 py-2 min-w-0"
          />
          <FaSearch className="text-blue-500" />
        </div>

        {/* Add Stock & Upload Buttons */}
        <div className="flex gap-2 justify-end md:justify-start">
          <button
            onClick={handleAddNewStock}
            className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full flex items-center"
          >
            <FiPlus size={20} />
          </button>
          <button
            onClick={handleUploadClick}
            className="bg-blue-400 hover:bg-blue-300 text-white px-3 rounded-full flex items-center"
          >
            <GoUpload size={20} />
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Product Table */}
      <div className="overflow-x-auto rounded-lg" style={{ maxHeight: '65vh' }}>
  <table className="min-w-full table-auto text-xs leading-tight">
    <thead className="bg-blue-300">
      <tr>
        <th className="py-1 px-2 text-left font-semibold">Product Number</th>
        <th className="py-1 px-2 text-left font-semibold">Category</th>
        <th className="py-1 px-2 text-left font-semibold">Vendor</th>
        <th className="py-1 px-2 text-left font-semibold">Stock Units</th>
        <th className="py-1 px-2 text-left font-semibold">Sold Units</th>
        <th className="py-1 px-2 text-left font-semibold">Available Unit</th>
        <th className="py-1 px-2 text-left font-semibold">Cost Price</th>
        <th className="py-1 px-2 text-left font-semibold">Price</th>
        <th className="py-1 px-2 text-left font-semibold">GST</th>
        <th className="py-1 px-2 text-left font-semibold">Action</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product, index) => (
        <tr key={product._id} className={index % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
          <td
            className="py-1 px-2 hover:underline cursor-pointer truncate"
            onClick={() => setSearchQuery(product.productNumber)}
            title={product.productNumber}
          >
            {product.product.productNumber.length > 30
              ? product.product.productNumber.slice(0, 30) + '...'
              : product.product.productNumber}
          </td>
          <td className="py-1 px-2">{product.product.category}</td>
          <td className="py-1 px-2">{product.vendor}</td>
          <td className="py-1 px-2">{product.currentStock} {product.unit_type}</td>
          <td className="py-1 px-2">{product.soldUnits} {product.unit_type}</td>
          <td className="py-1 px-2">{product.availableUnits}</td>
          <td className="py-1 px-2">Rs. {product.product?.cost_price || 0}</td>
          <td className="py-1 px-2">Rs. {product.product.rate}</td>
          <td className="py-1 px-2">{product.product.gst} %</td>
          <td className="py-1 px-2 flex gap-1">
            <button
              onClick={() => handleEdit(product.product._id)}
              className="bg-indigo-400 hover:bg-indigo-500 text-white p-1 rounded-full"
            >
              <FiEdit />
            </button>
            <button
              onClick={() => handleOpenEditModal(product)}
              className="bg-indigo-400 hover:bg-indigo-500 text-white p-1 rounded-full"
            >
              <FiPlus />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* Pagination */}
      <div className="flex justify-center items-center p-4  mt-4 rounded-full flex-wrap">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="p-2 rounded-full hover:bg-blue-200"
          disabled={currentPage === 1}
        >
          <FiChevronLeft size={20} />
        </button>

        {getPageWindow().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-full ${currentPage === page
              ? 'bg-blue-400 text-white'
              : 'bg-white text-gray-700 hover:bg-blue-100'
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="p-2 rounded-full hover:bg-blue-200"
          disabled={currentPage === totalPages}
        >
          <FiChevronRight size={20} />
        </button>
      </div>
     

    </div>

  );

}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiEdit, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { apiServerUrl } from '../constant/constants';
import empty from '../assets/empty-box.png';

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [isData, setIsData] = useState(0)
  const [formType, setFormType] = useState('Order Form');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const windowSize = 5;

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const delay = new Promise((resolve) => setTimeout(resolve, 500));

      try {
        const billRequest = axios.get(
          `${apiServerUrl}/bill/fetch-bill?formType=${encodeURIComponent(formType)}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const [res] = await Promise.all([billRequest, delay]);
        setBills(Array.isArray(res.data.bills) ? res.data.bills : []);
        setIsData(res.data.totalBillsInspiteOfFormType)
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        if(err.response?.status === 401 ){
          toast.error('Token Expired please login again');
          navigate('/login');
        } else {
          toast.error('Failed to fetch bills.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [formType, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="">
      {isData > 0 ? (
        <div className="bg-white p-4 rounded-xl relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl text-[#0D8BC5] font-bold">All Invoices</h1>
            <div className="flex justify-between items-center mb-4">
              <select
                value={formType}
                onChange={(e) => {
                  setFormType(e.target.value);
                  setCurrentPage(1);
                }}
                className="border px-2 py-1 rounded-md"
              >
                <option value="Order Form">Order Form</option>
                <option value="Invoice">Invoice</option>
                <option value="Estimate">Estimate</option>
              </select>

              <button
                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => toast.info(`Showing results for ${formType}`)}
              >
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-y-auto rounded-lg" style={{ maxHeight: '65vh' }}>
            <table className="min-w-full table-auto">
              <thead className="bg-blue-300">
                <tr>
                  <th className="p-3 text-left font-semibold">Customer Name</th>
                  <th className="p-3 text-left font-semibold">Customer Number</th>
                  <th className="p-3 text-left font-semibold">Bill Type</th>
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-left font-semibold">Total Items</th>
                  <th className="p-3 text-left font-semibold">Total Amount</th>
                  <th className="p-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => (
                  <tr key={bill._id} className={index % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
                    <td className="p-3">{bill.customerName}</td>
                    <td className="p-3">{bill.customerPhone}</td>
                    <td className="p-3">{bill.formType}</td>
                    <td className="p-3">{new Date(bill.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">{bill.products.length}</td>
                    <td className="p-3">₹{bill.totalAmount.toFixed(2)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate(`/customerOrder/${bill._id}`)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="View Invoice"
                      >
                        <FiEye size={20} />
                      </button>
                      {/* <button
                        onClick={() => navigate(`/invoice/edit/${bill._id}`)}
                        className="text-green-600 hover:text-green-800 ml-3"
                        title="Edit Invoice"
                      >
                        <FiEdit size={20} />
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center p-4 gap-2 mt-4 rounded-full">
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
                className={`px-3 py-1 rounded-full ${
                  currentPage === page
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
       ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <img src={empty} alt="No bills" className="w-40 mb-4" />
          <p className="text-lg">No bills to show right now.</p>
        </div>
      )} 
    </div>
  );
}

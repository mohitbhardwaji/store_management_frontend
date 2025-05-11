import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  Plus, Trash2, X } from 'lucide-react';
import { apiServerUrl } from '../constant/constants';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
  });

  const token = localStorage.getItem('token'); 

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiServerUrl}/sales-executives`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiServerUrl}/sales-executives`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', mobileNumber: '' });
      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    // if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`${apiServerUrl}/sales-executives/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Employees</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Create New Employee
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div key={emp._id} className="relative p-4 border rounded shadow">
              <button
                onClick={() => handleDeleteEmployee(emp._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
              <h3 className="text-lg font-semibold">{emp.name}</h3>
              <p className="text-sm text-gray-600">{emp.email}</p>
              <p className="text-sm text-gray-600">{emp.mobileNumber}</p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">Create Employee</h2>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;

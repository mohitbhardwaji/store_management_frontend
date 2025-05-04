import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const ExcelUploadModal = ({ isOpen, onClose, onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadDate, setUploadDate] = useState(new Date());
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleUpload = () => {
      if (selectedFile) {
        onFileUpload(selectedFile, uploadDate); // Pass the file and date
        onClose(); // Close the modal after successful (or attempted) upload
      } else {
        alert('Please select a file to upload.');
      }
    };
  
    if (!isOpen) {
      return null;
    }
  
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
        <div className="bg-white rounded-xl shadow-lg p-8 relative ">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
          <h2 className="text-xl text-[#0D8BC5] font-bold mb-4">Upload Excel File</h2>
  
          <div className="mb-4">
            <label htmlFor="fileInput" className="block text-gray-700 text-sm font-bold mb-2">
              Select Excel File:
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".xlsx, .csv"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <p className="text-gray-500 text-xs italic">Only .xlsx and .csv files are allowed.</p>
          </div>
  
          <div className="mb-4">
            <label htmlFor="datePicker" className="block text-gray-700 text-sm font-bold mb-2">
              Select Upload Date:
            </label>
            <DatePicker
              id="datePicker"
              selected={uploadDate}
              onChange={(date) => setUploadDate(date)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
  
          <div className="flex justify-end">
            <button
              className="bg-[#0D8BC5] hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleUpload}
            >
              Upload
            </button>
            <button
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };


  export default ExcelUploadModal
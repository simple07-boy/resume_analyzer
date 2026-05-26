import { useState } from 'react';

import API from '../services/api';

import { useNavigate } from 'react-router-dom';

import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

function UploadBox() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload only PDF files');
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!token) {
      toast.warning('Login first');

      navigate('/login');

      return;
    }

    if (!file) {
      toast.warning('Please select PDF');

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('file', file);

      const response = await API.post('/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      localStorage.setItem(
        'atsData',
        JSON.stringify(response.data.ats_analysis),
      );

      localStorage.setItem(
        'questions',
        JSON.stringify(response.data.interview_questions),
      );

      navigate('/dashboard');
    } catch (error) {
      console.log(error);

      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gray-900 p-5 md:p-10 rounded-3xl w-full max-w-2xl shadow-2xl'>
      <div className='flex flex-col gap-6'>
        {!file ? (
          <label className='bg-black border border-gray-700 p-5 rounded-xl text-center cursor-pointer hover:border-green-500 transition'>
            <input
              type='file'
              accept='.pdf'
              onChange={handleFileChange}
              className='hidden'
            />

            <span className='text-white text-base md:text-lg'>
              Choose Resume PDF
            </span>
          </label>
        ) : (
          <div className='bg-black border border-green-500 p-5 rounded-xl'>
            <div className='flex justify-between items-center'>
              <div>
                <p className='text-green-400 break-all font-semibold'>
                  {file.name}
                </p>

                <p className='text-gray-400 text-sm mt-2'>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                onClick={removeFile}
                className='text-red-500 hover:text-red-700 text-xl'
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {file && (
          <button
            onClick={() => window.open(URL.createObjectURL(file), '_blank')}
            className='w-full bg-blue-500 hover:bg-blue-600 p-4 rounded-xl font-bold text-lg transition'
          >
            Preview Resume
          </button>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`p-3 md:p-4 rounded-xl font-bold text-base md:text-lg transition ${
            loading ? 'bg-gray-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </div>
    </div>
  );
}

export default UploadBox;

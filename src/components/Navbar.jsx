import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();

    localStorage.removeItem('atsData');

    localStorage.removeItem('questions');

    toast.success('Logged out');

    navigate('/login');
  };

  return (
    <div className='sticky top-0 z-50 bg-gray-900 text-white px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-lg'>
      <Link to='/'>
        <h1 className='text-2xl md:text-3xl font-bold cursor-pointer text-center md:text-left'>
          AI Resume Analyzer
        </h1>
      </Link>

      {user ? (
        <div className='relative'>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className='bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-xl border border-gray-700 transition'
          >
            {user?.name || 'Profile'}
          </button>

          {showDropdown && (
            <div className='absolute right-0 mt-3 w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-5 z-50'>
              <div className='border-b border-gray-700 pb-4 mb-4'>
                <h2 className='text-xl font-bold text-white'>{user?.name}</h2>

                <p className='text-gray-400 text-sm mt-1'>{user?.email}</p>
              </div>

              <div className='flex flex-col gap-3'>
                <Link
                  to='/history'
                  onClick={() => setShowDropdown(false)}
                  className='bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-center font-semibold transition'
                >
                  History
                </Link>

                <button
                  onClick={handleLogout}
                  className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-semibold transition'
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='flex flex-wrap items-center gap-3 md:gap-5'>
          <Link
            to='/login'
            className='bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-semibold transition'
          >
            Login
          </Link>

          <Link
            to='/signup'
            className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl font-semibold transition'
          >
            Signup
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;

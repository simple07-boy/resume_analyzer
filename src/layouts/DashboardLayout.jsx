import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function DashboardLayout() {
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    localStorage.removeItem('atsData');

    localStorage.removeItem('questions');

    toast.success('Logged out');

    navigate('/login');
  };

  return (
    <div className='flex flex-col md:flex-row bg-black min-h-screen'>
      <Sidebar handleLogout={handleLogout} />

      <div className='flex-1 p-4 md:p-8 text-white overflow-y-auto'>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;

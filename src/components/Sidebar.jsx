import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, LogOut, Home } from 'lucide-react';

function Sidebar({ handleLogout }) {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Home',
      path: '/',
      icon: <Home size={20} />,
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'History',
      path: '/history',
      icon: <History size={20} />,
    },
  ];

  return (
    <div className='w-full md:w-64 md:min-h-screen bg-gray-950 border-b md:border-b-0 md:border-r border-gray-800 text-white p-4 md:p-6 sticky top-0 z-40'>
      <h1 className='text-2xl md:text-3xl font-bold text-green-400 mb-5 md:mb-10'>
        AI Resume
      </h1>

      <div className='flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible'>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              location.pathname === item.path
                ? 'bg-green-500 text-white'
                : 'hover:bg-gray-800'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className='flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition mt-10'
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

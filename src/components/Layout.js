import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaSignOutAlt, FaTachometerAlt, FaList } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold flex items-center">
            <FaBoxOpen className="mr-2" />
            Inventory Manager
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-700"
              >
                <FaTachometerAlt className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-700"
              >
                <FaList className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-white" />
                <span className="ml-3">Products</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center mr-2">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-gray-700"
          >
            <FaSignOutAlt className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Shop Inventory</h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
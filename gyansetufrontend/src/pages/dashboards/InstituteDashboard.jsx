import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/api/authService';

const InstituteDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <nav className="bg-purple-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Institute Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.firstName || 'Institute'}</span>
            <button
              onClick={handleLogout}
              className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-purple-900 mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-600">
            This is your institute dashboard. More features will be added soon!
          </p>
        </div>
      </main>
    </div>
  );
};

export default InstituteDashboard; 
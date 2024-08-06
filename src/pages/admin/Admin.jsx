// AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEdit, faTasks, faEye, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AddRemotEmployee from './AddRemotEmployee';
import AssignTask from './AssignTask';
import ViewTask from './ViewTask';
import { useNavigate } from 'react-router-dom';
import UpdateDeleteTask from './updateDeleteTask';
import EditEmployee from './EditEmployee';

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [toggle, setToggle] = useState(false);

  const navigate = useNavigate();
  const userString = localStorage.getItem('user');

  const user = userString ? JSON.parse(userString) : {};
  const username = user.first_name

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleLogout = () => {
    setSelectedOption('logout');
    navigate('/login');
  };

  useEffect(() => {
    // Check if the user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      // Redirect to login if the user is not an admin
      window.location.href = '/login';
    }
  }, []);

  return (
    <section>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        {/* Left Panel */}
        <div className={`w-1/3 bg-gray-800 text-white border-r overflow-y-auto z-100 ${toggle ? 'hidden' : 'block'}`}>
          <div className="p-4">
            <h2 className="md:text-2xl font-semibold mb-4 text-sm">Admin Dashboard</h2>
            <div className="space-y-2 mt-32">
              <div className="mt-2">
                <ul>
                  <li
                    className={`block ml-4 px-4 py-2 rounded hover:bg-blue-500 cursor-pointer ${
                      selectedOption === 'addRemotEmployees' ? 'bg-blue-500 cursor-pointer text-white' : ''
                    }`}
                    onClick={() => handleOptionClick('addRemotEmployees')}
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> <span className="hidden md:inline">Add Employee</span>
                  </li>
                  <li
                    className={`block ml-4 px-4 py-2 rounded hover:bg-blue-500 cursor-pointer ${
                      selectedOption === 'editRemotEmployees' ? 'bg-blue-500 cursor-pointer text-white' : ''
                    }`}
                    onClick={() => handleOptionClick('editRemotEmployees')}
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" /> <span className="hidden md:inline">Edit Employee</span>
                  </li>
                  <li
                    className={`block ml-4 px-4 py-2 rounded hover:bg-blue-500 cursor-pointer ${
                      selectedOption === 'assignTask' ? 'bg-blue-500 cursor-pointer text-white' : ''
                    }`}
                    onClick={() => handleOptionClick('assignTask')}
                  >
                    <FontAwesomeIcon icon={faTasks} className="mr-2" /> <span className="hidden md:inline">Assign Task</span>
                  </li>
                  <li
                    className={`block ml-4 px-4 py-2 rounded hover:bg-blue-500 cursor-pointer ${
                      selectedOption === 'updateTask' ? 'bg-blue-500 cursor-pointer text-white' : ''
                    }`}
                    onClick={() => handleOptionClick('updateTask')}
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" /> <span className="hidden md:inline">Update Task</span>
                  </li>
                  <li
                    className={`block ml-4 px-4 py-2 rounded hover:bg-blue-500 cursor-pointer ${
                      selectedOption === 'viewTask' ? 'bg-blue-500 cursor-pointer text-white' : ''
                    }`}
                    onClick={() => handleOptionClick('viewTask')}
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" /> <span className="hidden md:inline">View Tasks</span>
                  </li>
                </ul>
              </div>
              <button
                className={`block text-red-500 cursor-pointer w-full text-left px-4 md:px-6 py-2 rounded ${
                  selectedOption === 'logout' ? 'text-red-500 cursor-pointer' : 'hover:bg-blue-500 cursor-pointer'
                }`}
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className=" mx-2" /> Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-4 overflow-y-auto text-black w-full ">
          <div className='flex flex-row gap-10'>
            <button onClick={() => setToggle(!toggle)} className="flex items-center justify-center">
              {toggle ? <span className='bg-gray-800 text-white rounded-full p-1'>&rarr;</span> : <span className='bg-gray-800 text-white rounded-full p-1' >&larr;</span>}
            </button>
            <h1>👋 WELCOME BACK {username}!</h1>
          </div>
          {/* Render content based on selectedOption */}
          {selectedOption === 'addRemotEmployees' && <AddRemotEmployee />}
          {selectedOption === 'editRemotEmployees' && <EditEmployee />}
          {selectedOption === 'assignTask' && <AssignTask />}
          {selectedOption === 'updateTask' && <UpdateDeleteTask />}
          {selectedOption === 'viewTask' && <ViewTask />}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;

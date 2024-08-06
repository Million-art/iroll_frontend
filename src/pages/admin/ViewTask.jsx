import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../../constant';
const ViewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
 
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/tasks/task`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDeleteConfirmation = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteConfirmationVisible(true);
  };

  // Function to close the delete confirmation popup
  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setDeleteConfirmationVisible(false);
  };
   // Function to confirm and delete the task
   const handleConfirmDelete = async () => {
    try {
      // Send delete request to the API
      await axios.delete(`${apiBaseUrl}/tasks/task/${taskToDelete}`);
      // Update tasks state after deletion
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete));
      // Close the delete confirmation popup
      setDeleteConfirmationVisible(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const handleDeleteClick = (taskId) => {
    // Open the delete confirmation popup
    handleDeleteConfirmation(taskId);
  };
  
  const formatDateTime = (dateTimeString) => {
    if(dateTimeString === null)
    return 'null';
    else{
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateTimeString).toLocaleString('en-US', options);
    }
 
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'finished':
        return 'bg-green-200';
      case 'Pending':
        return 'bg-yellow-200';
      case 'on progress':
        return 'bg-blue-200';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {tasks.length ? tasks.map((task) => (
        <div
          key={task.id}
          className={`max-w-sm m-4 shadow-md rounded-md overflow-hidden ${getStatusColor(task.status)}`}
        >
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{task.name}</div>
            <p className="text-gray-600 text-sm mb-2">{task.description}</p>
            <p className="text-gray-700 text-base">
              Assigned to: {task.assign_to}<br />
              Status: {task.status}<br />
              Start Time: {formatDateTime(task.start_time)}<br />
              End Time: {formatDateTime(task.end_time)}<br />
            </p>
          </div>
          <button
              onClick={() => handleDeleteClick(task.id)}
              className="bg-red-500 text-white px-4 py-2 rounded w-full"
            >
              Delete
            </button>
        </div>
      ))
      : <h1>No available tasks</h1>}

      {deleteConfirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
          <div className="bg-white p-4 rounded-lg shadow-md w-[400px]">
            <p className="text-xl font-bold mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleConfirmDelete}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 ml-2 rounded"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTask;

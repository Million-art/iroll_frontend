import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../../constant';
const UpdateDeleteTask = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [estimateHour, setEstimateHour] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherEstimateHours, setOtherEstimateHours] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [employees, setEmployees] = useState([]);  
  const [admin, setAdmin] = useState([]);   


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


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/remotemployee/employees`);
        const emails = response.data.map((employee) => employee.email);
        setEmployees(emails);

        // Fetch admins
        const adminResponse = await axios.get(`${apiBaseUrl}/remotemployee/employees`);
        const adminEmployees = adminResponse.data.filter((employee) => employee.role === 'admin');
        const adminEmails = adminEmployees.map((employee) => employee.email);

        setAdmin(adminEmails);
      } catch (error) {
        console.error('Error fetching employees from the server:', error);
      }
    };

    fetchEmployees();
  }, []);
 
 const handleEstimateHourChange = (e) => {

  const selectedValue = e.target.value;
  if (selectedValue === 'other') {
    setIsOtherSelected(true);
      setEstimateHour( selectedValue)
 
  } else {
    setIsOtherSelected(false);
    setEstimateHour(selectedValue);
  }
};

  
const handleConfirmUpdate = async () => {
  try {
    // Update editingTask fields before sending the update request
    const updatedTask = {
      ...editingTask,
      description: taskDescription,
      // Add other fields that need to be updated
    };

    await axios.put(`${apiBaseUrl}/tasks/task/${editingTask.id}`, updatedTask);

    // Close the popup
    setPopupVisible(false);

    // Fetch updated tasks and update state
    const response = await axios.get(`${apiBaseUrl}/tasks/task`);
    setTasks(response.data);
  } catch (error) {
    console.error('Error updating task:', error);
  }
};


  const handleCancelUpdate = () => {
    // Close the popup
    setPopupVisible(false);
    // Reset editingTask state
    setEditingTask(null);
  };

  const handleUpdateClick = (task) => {
    setEditingTask(task);
    setPopupVisible(true);
  };


 

  const updateDeleteTask = () => {
    // Filter tasks with status 'Pending'
    const pendingTasks = tasks.filter(task => task.status === 'Pending');

    return (
      <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pendingTasks.map(task => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Name: {task.name}</h3>
            <p className="text-gray-600 mb-2">Description: {task.description}</p>
            <p className="text-gray-600 mb-2">Status: {task.status}</p>
            <p className="text-gray-600 mb-2">Assigned to: {task.assign_to}</p>
            <p className="text-gray-600 mb-2">Assigned by: {task.assigned_by}</p>
            <p className="text-gray-600 mb-2">Estimated Hours: {task.estimate_hour}</p>
            <p className="text-gray-600 mb-2">Priority: {task.task_priority}</p>
            <button
              onClick={() => handleUpdateClick(task)}
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
            >
              Update
            </button>
           
        </div>
        ))}
         <>
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
          <div className="bg-white p-4 rounded-lg shadow-md w-[500px]">
            {/* Render editable fields for editingTask */}
            <h3 className='text-2xl text-center'>Edit Task</h3>
             <div className="grid grid-cols-2 gap-8">
                <div>  
                    <div>
                    <label htmlFor="taskName" className="block text-sm font-medium text-gray-600">
                        Task Name:
                    </label>
                    <input
                        type="text"
                        id="taskName"
                        value={editingTask.name}
                        onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                        className='mt-1 p-2 w-full border rounded-md'
                    />
                    </div>
                    <div>
                    <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-600">
                        Task Description:
                    </label>
                    <textarea
                    id="taskDescription"
                    value={taskDescription} // Use taskDescription state
                    onChange={(e) => setTaskDescription(e.target.value)} // Update taskDescription state
                    className="mt-1 p-2 w-full border rounded-md"
                    />

                    </div>
                    <div>
                    <label htmlFor="employeeList" className="block text-sm font-medium text-gray-600">
                        Assign To:
                    </label>
                    <select
                      id="employeeList"
                      value={selectedEmployee} // Update selectedEmployee state
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md"
                    >

                        <option value="">Select Employee</option>
                        {employees.map((employee, index) => (
                        <option key={index} value={employee}>
                            {employee}
                        </option>
                        ))}
                    </select>
                    </div>
                    <div>
                    <label htmlFor="assignByList" className="block text-sm font-medium text-gray-600">
                        Assign By:
                    </label>
                    <select
                      id="assignByList"
                      value={selectedAdmin} // Update selectedAdmin state
                      onChange={(e) => setSelectedAdmin(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md"
                    >

                        <option value="">Select Admin</option>
                        {admin.map((admin, index) => (
                        <option key={index} value={admin}>
                            {admin}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>
                <div> 
                    <div>
                    <label htmlFor="taskType" className="block text-sm font-medium text-gray-600">
                        Task Type:
                    </label>
                    <select
                        id="taskType"
                        value={editingTask.taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md"
                    >
                        <option value="" disabled>
                        Select Task Type
                        </option>
                        <option value="design">Design</option>
                        <option value="branding">Branding</option>
                        <option value="promotion">Promotion</option>
                        <option value="bot_dev">Bot Development</option>
                        <option value="web_dev">Web Development</option>
                        <option value="video">Video</option>
                    </select>
                    </div>
                    <div>
                    <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-600">
                        Priority:
                    </label>
                    <div className="flex items-center space-x-4 mt-4">
                        <input
                        type="radio"
                        id="priorityHigh"
                        value="High"
                        checked={taskPriority === 'High'}
                        onChange={() => setTaskPriority('High')}
                        />
                        <label htmlFor="priorityHigh">High</label>

                        <input
                        type="radio"
                        id="priorityLow"
                        value="Low"
                        checked={taskPriority === 'Low'}
                        onChange={() => setTaskPriority('Low')}
                        />
                        <label htmlFor="priorityLow">Low</label>
                    </div>
                    </div>
                    <div>
                    <label htmlFor="estimateHour" className="block text-sm font-medium text-gray-600">
                        Estimate Hour:
                    </label>
                    <select
                        id="estimateHour"
                        value={isOtherSelected ? 'other' : estimateHour}
                        onChange={handleEstimateHourChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    >
                        <option value="" disabled>
                        Select Estimate Hour
                        </option>
                        <option value="1">1 Hour</option>
                        <option value="2">2 Hours</option>
                        <option value="3">3 Hours</option>
                        <option value="other">Other</option>
                    </select>
                    {isOtherSelected && (
                        <div className="mt-2">
                        <label htmlFor="otherEstimateHours" className="block text-sm font-medium text-gray-600">
                            Enter Estimate Hours:
                        </label>
                        <input
                          type="number"
                          id="otherEstimateHours"
                          value={otherEstimateHours}
                          onChange={(e) => setOtherEstimateHours(e.target.value)}
                          className="mt-1 p-2 w-full border rounded-md"
                        />

                        </div>
                    )}
                    </div>
                </div>
            </div> 
            <div className='flex flex-row gap-5'>
                <button 
                type="submit" className="bg-green-500 text-white py-2 px-4 mt-6 rounded-md w-40 h-10"
                onClick={handleConfirmUpdate}
                >
                    Confirm
                </button>
                <button 
                className="bg-blue-500 text-white py-2 px-4 mt-6 rounded-md w-40 h-10"
                onClick={handleCancelUpdate}
                >
                    Cancel
                </button>
            </div>
          </div>
        </div>
      )}
    </>
    <div>
      
    </div>
    </div>

    
);
};

  return updateDeleteTask();
};

export default UpdateDeleteTask;

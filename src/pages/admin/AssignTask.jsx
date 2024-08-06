import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../../constant';
const AssignTask = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [estimateHour, setEstimateHour] = useState('');  
  const [counter, setCounter] = useState(0);
  const [error, setError] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherEstimateHours, setOtherEstimateHours] = useState('');
  const [taskPriority, setTaskPriority] = useState(''); 
 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/remotemployee/employees`);
        const usernames = response.data.map((employee) => employee.username);
        setEmployees(usernames);

        // Fetch admins
        const adminResponse = await axios.get(`${apiBaseUrl}/remotemployee/employees`);
        const adminEmployees = adminResponse.data.filter((employee) => employee.role === 'admin');
        const adminusernames = adminEmployees.map((employee) => employee.username);

        setAdmin(adminusernames);
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
  const createTask = async (e) => {
    e.preventDefault();

    const newTask = {
      name: taskName.trim(),
      description: taskDescription.trim(),
      assign_time: new Date(),
      assign_to: selectedEmployee,
      status: 'Pending',
      start_time: null,
      end_time: null,
      working_hours: null,
      assigned_by: selectedAdmin,
      task_type: taskType,
      company_name: companyName,
      estimate_hour: isOtherSelected ? otherEstimateHours : estimateHour,
      task_priority: taskPriority,
      counter: counter,
    };

    if (newTask.name !== '' && newTask.description !== '' && newTask.assign_to !== '' && newTask.task_type !== '') {
      try {
        const response = await axios.post(`${apiBaseUrl}/tasks/task`, newTask);

        if (response.status === 201) {
          // Task created successfully on the server
          setTasks((prevTasks) => [...prevTasks, response.data]);  
          setTaskName('');
          setTaskDescription('');
          setSelectedEmployee('');
          setTaskType('');
          setCompanyName('');
          setCounter(0);
          setEstimateHour('');  
          setTaskPriority('')
          setOtherEstimateHours('')

          setError('');
        } else {
          // Handle other status codes
          setError(`Error creating task on the server. Status code: ${response.status}`);
        }
      } catch (error) {
        // Handle network error
        setError('Network error. Please try again.');
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 p-6 bg-white shadow-md rounded-md">
    <h2 className="text-2xl font-bold mb-4">Assign Task</h2>

    {error && <p className="text-red-500 mb-4">{error}</p>}

    <form onSubmit={createTask} className="mb-4 space-y-4">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label htmlFor="taskName" className="block text-sm font-medium text-gray-600">
            Task Name:
          </label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-600">
            Task Description:
          </label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-600">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="assignmentTime" className="block text-sm font-medium text-gray-600">
            Assignment Time:
          </label>
          <input
            type="text"
            id="assignmentTime"
            value={new Date().toLocaleString()}
            disabled
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label htmlFor="employeeList" className="block text-sm font-medium text-gray-600">
            Assign To:
          </label>
          <select
            id="employeeList"
            value={selectedEmployee}
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
          <label htmlFor="employeeList" className="block text-sm font-medium text-gray-600">
            Assign By:
          </label>
          <select
            id="employeeList"
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option value="">Select Employee</option>
            {admin.map((admin, index) => (
              <option key={index} value={admin}>
                {admin}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label htmlFor="taskType" className="block text-sm font-medium text-gray-600">
            Task Type:
          </label>
          <select
            id="taskType"
            value={taskType}
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
        <div className="grid grid-cols-2 gap-8">
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
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 mt-6 rounded-md w-40 h-10">
          Create Task
        </button>
      </div>

   
    </form>
  </div>
  );
};

export default AssignTask;

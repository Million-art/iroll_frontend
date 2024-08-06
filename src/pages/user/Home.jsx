import React, { useState, useEffect } from 'react';
import Nav from '../../components/Nav';
import axios from 'axios';
import { apiBaseUrl } from '../../constant';
const RemotEmployeesHome = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};
  const username = user.username;

  const [tasks, setTasks] = useState([]);
  const [inProgressTaskId, setInProgressTaskId] = useState(null);
  const [inProgressTask, setInProgressTask] = useState([]);
  const [avilableTasks, setAvilableTasks] = useState([]);
  const [filteredAvilableTasks, setFilteredAvilableTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const userUsername = user.username;
 
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/tasks/task${userUsername}`);
        const taskResponse = response.data.filter(task => task.status === "Pending");
        const progressTaskResponse = response.data.filter(task => task.status === "in progress");
    
        setTasks(taskResponse);
        setInProgressTask(progressTaskResponse);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchAvilableTasks = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/tasks/task${userUsername}`);

        setAvilableTasks(response.data);
        setFilteredAvilableTasks(response.data);
      } catch (error) {
        console.error('Error fetching avilableTasks:', error);
      }
    };

    // Call the function to fetch tasks and avilableTasks when the component mounts
    fetchTasks();
    fetchAvilableTasks();
    
  }, [userUsername, username]);

  useEffect(() => {
    // Apply filtering based on status when statusFilter changes
    if (statusFilter === 'All') {
      setFilteredAvilableTasks(avilableTasks);
    } else {
      const filtered = avilableTasks.filter(task => task.status.toLowerCase() === statusFilter.toLowerCase());
      setFilteredAvilableTasks(filtered);
    }
  }, [statusFilter, avilableTasks]);

  // function that control start button click
  const handleStartTask = async (taskId) => {
    try {
      // Check if there is already a task in progress
      if (inProgressTaskId) {
        // Check if the in-progress task has high priority
        const isInProgressTaskHighPriority = inProgressTask.some(task => task.task_priority === 'High');
  
        // Check if the new task has high priority
        const newTask = avilableTasks.find(task => task.id === taskId);
        const isNewTaskHighPriority = newTask && newTask.task_priority === 'High';
  
        // Allow starting the new task if it has high priority or the in-progress task doesn't have high priority
        if (!isInProgressTaskHighPriority || isNewTaskHighPriority) {
          const start_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
          setInProgressTaskId(taskId);
  
          await axios.put(`${apiBaseUrl}/tasks/task/${taskId}`, { status: 'in progress', start_time });
  
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === taskId ? { ...task, start_time } : task
            )
          );
  
          localStorage.setItem('currentTask', JSON.stringify({ taskId, start_time }));
        } else {
          console.log('Cannot start a new task with high priority while another high-priority task is in progress.');
        }
      } else {
        // If there is no task in progress, start the new task
        const start_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        setInProgressTaskId(taskId);
  
        await axios.put(`${apiBaseUrl}/tasks/task/${taskId}`, { status: 'in progress', start_time });
  
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, start_time } : task
          )
        );
  
        localStorage.setItem('currentTask', JSON.stringify({ taskId, start_time }));
      }
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };
  
// function to controll finish button click
  const handleFinishTask = async (taskId) => {
    try {
      // Get the current time for end_time
      const end_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
      // Retrieve the start_time from local storage
      const { start_time } = JSON.parse(localStorage.getItem('currentTask')) || {};
  
      // Calculate and display elapsed time if start_time is available
      if (start_time) {
        // Removed elapsed time and working hours calculation and display
  
        // Create a PUT request to update the task status to "finished" and set the end_time
        await axios.put(`${apiBaseUrl}/tasks/task/${taskId}`, {
          status: 'finished',
          end_time: end_time,
        });
      }
  
      // Remove the finished task from the local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setInProgressTask((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  
      // Reset the in-progress task state
      setInProgressTaskId(null);
  
      // Clear the current task from local storage
      localStorage.removeItem('currentTask');
    } catch (error) {
      console.error('Error finishing task:', error);
    }
  };
  
  const formatTime = (timeString) => {
    if (!timeString) {
      return 'Not available';
    }

    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-200';
      case 'in progress':
        return 'bg-gray-200';
      case 'finished':
        return 'bg-green-200';
      default:
        return 'bg-white';
    }
  };

  useEffect(() => {
    // Check if the user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
     if (!user) {
      // Redirect to login if the user is not an admin
      window.location.href = '/login';
    }
  }, []);
  


  return (
    <div>
      <Nav />
      <div>
        <h2 className='text-2xl mx-5 my-5'>New Tasks</h2>
        {!tasks ? (
          <p className='text-lg text-red-600'>No new tasks assigned to you.</p>
        ) : (
          <div className="flex flex-wrap">
          {tasks.map((task) => (
            <div key={task.id} className={`m-2 p-4 border rounded-md ${getStatusColor(task.status)}`}>
              <h2 className="text-xl font-bold">Task Name: <strong>{task.name}</strong></h2>
              <p className="text-gray-600">Task Description: {task.description}</p>
              <p className="text-gray-600">Estimated Hour: {task.estimate_hour}</p>
              {task && task.task_priority && task.task_priority === 'High' ?  
                <p className=''>Priority: High</p>:(
                <p className=''>Priority: Low</p>
                
                
               )}
              <div className="mt-4">
                {inProgressTaskId === task.id ? (
                  <>
                    <p>Start Time: {formatTime(task.start_time)}</p>
                    {/* Removed elapsed time and working hours display */}
                    <button onClick={() => handleFinishTask(task.id)} className="bg-blue-500 text-white py-1 px-2 rounded-md">
                      Finish
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleStartTask(task.id)} className="bg-green-500 text-white py-1 px-2 rounded-md mr-2">
                    Start
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        )}
      </div>
      <div>
        {inProgressTask.map((task) => (
          <div key={task.id} className={`m-2 p-4 border rounded-md ${getStatusColor(task.status)}`}>
            <h2 className="text-xl font-bold">Task Name: <strong>{task.name}</strong></h2>
            <p className="text-gray-600">Task Description: {task.description}</p>
            <p>Start Time: {formatTime(task.start_time)}</p>
            <p>Time: running...</p>
            <button onClick={() => handleFinishTask(task.id)} className="bg-blue-500 text-white py-1 px-2 rounded-md">
              Finish
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4">
        <h1 className="text-2xl mx-5 my-5">Your Tasks</h1>
        <div className="mb-4">
          <div className="mb-4">
            <label className="mr-2">Filter by Status:</label>
            <select
              className="p-2 border rounded-md"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAvilableTasks.map((task) => (
              <div
                key={task.id}
                className={`border rounded-md p-4 shadow-md ${getStatusColor(task.status)}`}
              >
                <h3 className="text-xl font-bold mb-2">{task.name}</h3>
                <p className="text-gray-600 mb-2">Description: {task.description}</p>
                <p className="text-gray-600 mb-2">Assign Time: {formatTime(task.assign_time)}</p>
                 {task && task.task_priority && task.task_priority === 'High' ?  
                <p>Priority: High</p>:(
                <p>Priority: Low</p>
                
                
               )}
                <p className="text-gray-600 mb-2">Status: {task.status}</p>
                <p className="text-gray-600 mb-2">Start Time: {formatTime(task.start_time)}</p>
                <p className="text-gray-600 mb-2">End Time: {formatTime(task.end_time)}</p>
                {/* Removed working hours display */}
                <p className="text-gray-600">Assigned By: {task.assigned_by}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

 

export default RemotEmployeesHome;

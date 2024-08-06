import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../../constant';
const Tasks = () => {

    const user = JSON.parse(localStorage.getItem('user')) || {}; // Parse the stored JSON
    const email = user.email
   const [avilableTasks, setavilableTasks] = useState([]);
  const [filteredavilableTasks, setFilteredavilableTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All'); // Default to show all avilableTasks

  useEffect(() => {
    const fetchavilableTasks = async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/avilableTasks/task`, {
            params: { email: email },  
          });
      
          console.log('API Response:', response);
      
          setavilableTasks(response.data);
          setFilteredavilableTasks(response.data);
        } catch (error) {
          console.error('Error fetching avilableTasks:', error);
        }
      };
      
      

    // Call the function to fetch avilableTasks when the component mounts
    fetchavilableTasks();
  }, []);

  useEffect(() => {
    // Apply filtering based on status when statusFilter changes
    if (statusFilter === 'All') {
      setFilteredavilableTasks(avilableTasks);
    } else {
      const filtered = avilableTasks.filter(task => task.status === statusFilter);
      setFilteredavilableTasks(filtered);
    }
  }, [statusFilter, avilableTasks]);

  return (
    <div>
      {/* Status filtering options */}
      <div>
        <label>
          Filter by Status:
          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Finished">Finished</option>
          </select>
        </label>
      </div>

      {/* Render avilableTasks as cards */}
      <div>
        {filteredavilableTasks.map((task) => (
          <div key={task.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h3>{task.name}</h3>
            <p>Description: {task.description}</p>
            <p>Assign Time: {task.assign_time}</p>
            <p>Status: {task.status}</p>
            <p>Start Time: {task.start_time}</p>
            <p>End Time: {task.end_time}</p>
            <p>Working Hours: {task.working_hours}</p>
            <p>Assigned By: {task.assigned_by}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;

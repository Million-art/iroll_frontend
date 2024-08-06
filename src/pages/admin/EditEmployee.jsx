import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../../constant';

const EditEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    role: 'user',
    password: '', // Added password field to form data
  });
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [showEmployeeToEdit, setShowEmployeeToEdit] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Function to fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/remotemployee/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  // Function to handle edit employee
  const handleEdit = (id) => {
    const selectedEmployee = employees.find((employee) => employee.id === id);
    setFormData({ 
      first_name: selectedEmployee.first_name,
      last_name: selectedEmployee.last_name,
      username: selectedEmployee.username,
      role: selectedEmployee.role,
      password: selectedEmployee.password, // Populate password field with selected employee's password
    });
    setEmployeeToEdit(id);
    setShowEmployeeToEdit(true);
  };

  // Function to handle delete employee
  const handleDelete = (id) => {
    setEmployeeToDelete(id);
    setShowDeleteConfirmation(true);
  };

  // Function to confirm employee deletion
  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`${apiBaseUrl}/remotemployee/employees/${employeeToDelete}`);
      if (response.status === 204) {
        const updatedEmployees = employees.filter((employee) => employee.id !== employeeToDelete);
        setEmployees(updatedEmployees);
      } else {
        console.error('Error deleting employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting employee:', error.message);
    } finally {
      setEmployeeToDelete(null);
      setShowDeleteConfirmation(false);
    }
  };

  // Function to cancel employee deletion
  const cancelDelete = () => {
    setEmployeeToDelete(null);
    setShowDeleteConfirmation(false);
  };

  // Function to cancel employee edit
  const cancelEdit = () => {
    setEmployeeToEdit(null);
    setShowEmployeeToEdit(false);
    setFormData({
      first_name: '',
      last_name: '',
      username: '',
      role: 'user',
      password: '', // Reset password field
    });
  };

  // Function to confirm employee edit
  const confirmEdit = async () => {
    try {
      const response = await axios.put(`${apiBaseUrl}/remotemployee/employees/${employeeToEdit}`, formData);
      if (response.status === 200) {
        const updatedEmployees = employees.map((employee) =>
          employee.id === employeeToEdit ? { ...employee, ...formData } : employee
        );
        setEmployees(updatedEmployees);
        setShowEmployeeToEdit(false);
        setFormData({
          first_name: '',
          last_name: '',
          username: '',
          role: 'user',
          password: '', // Reset password field
        });
      } else {
        console.error('Error updating employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating employee:', error.message);
    }
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="pt-10">
      <h1 className="text-xl font-bold pl-4">Available Employees</h1>
      {employees.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-center mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">username</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="border px-4 py-2">{employee.first_name}</td>
                  <td className="border px-4 py-2">{employee.last_name}</td>
                  <td className="border px-4 py-2">{employee.username}</td>
                  <td className="border px-4 py-2">{employee.role}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(employee.id)}
                      className="mr-2 text-blue-500 font-medium py-1 px-3 rounded sm:py-2 sm:px-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="text-red-700 font-medium py-1 px-3 rounded sm:py-2 sm:px-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-4 rounded">
            <p className="text-lg font-semibold mb-2">Confirm Deletion</p>
            <p className="mb-4">Are you sure you want to delete this employee?</p>
            <div className="flex justify-end">
              <button onClick={cancelDelete} className="mr-2 px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Popup */}
      {showEmployeeToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-4 rounded max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name">First Name:</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="last_name">Last Name:</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="username">username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="role">Role:</label>
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={cancelEdit} className="mr-2 px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={confirmEdit} className="px-4 py-2 bg-red-500 text-white rounded">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditEmployee;

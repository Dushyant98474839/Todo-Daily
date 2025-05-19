import { useState } from 'react';
import { PlusSquareTwoTone } from '@ant-design/icons';
import TodoForm from './TodoForm.jsx';
import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const AddNew = ({setTasks}) => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = () => {
    setShowForm((prev) => !prev);
  };

  const HandleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to add a task.');
        setIsLoading(false);
        return;
      }
      console.log('Form data:', formData);
      const response = await axios.post(
        `${API_BASE_URL}/tasks`,
        {
          title: formData.title,
          description: formData.description,
          status: formData.status,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  }

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleAdd}
        className="flex flex-row items-center justify-center bg-black rounded-lg p-3 hover:border hover:border-white duration-100 cursor-pointer"
      >
        <PlusSquareTwoTone />
        <span className="text-lg ml-3 text-white">Add New</span>
      </div>

      {showForm && (
        <div className="mt-4 w-full max-w-xl">
          <TodoForm HandleFormSubmit={HandleFormSubmit} closeForm={handleCancel} />
        </div>
      )}
    </div>
  );
};

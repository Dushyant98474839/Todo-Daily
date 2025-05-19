import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

function Card({ id,title, description, status, date, setTasks }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);
  const [localStatus, setLocalStatus] = useState(status);
  const [localid, setLocalid] = useState(id);
  const [localDate, setLocalDate] = useState(date);

  useEffect(() => {
    setLocalTitle(title);
    setLocalDescription(description);
    setLocalStatus(status);
    setLocalDate(date);
    setLocalid(id);
  }, [id, title, description, status, date]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/tasks/${localid}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Deleted task:', response.data);
      setTasks((prevTasks) => prevTasks.filter((task) => task.uuid !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleSave = async () => {
    try{
      console.log('localdate:', localDate);
      const response = await axios.put(`http://localhost:8000/tasks/${localid}`, {
        title: localTitle,
        description: localDescription,
        status: localStatus,
        date:localDate,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      },);
    }
    catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
      
    } finally {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.uuid === localid
            ? { ...task, title: localTitle, description: localDescription, status: localStatus }
            : task
        )
      );
    setLocalTitle(localTitle);
    setIsEditMode(false);
  }
};

  const handleCancel = () => {
    setLocalTitle(title);
    setLocalDescription(description);
    setLocalStatus(status);
    setIsEditMode(false);
  };

  return (
    <div className="todocard flex flex-col w-full bg-white rounded-lg p-4 m-4 shadow-md">
      <div className="flex flex-row w-full mb-4 items-center justify-between">
        <div className="flex flex-col w-full">
          {isEditMode ? (
            <>
              <Input
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                className="mb-2"
              />
              <span className="text-xs text-gray-500">{localDate?localDate.slice(0, 16).replace('T', '\t'):null }</span>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-black">{localTitle}</h2>
              <span className="text-xs text-gray-500">{localDate?localDate.slice(0, 16).replace('T', '\t'):null }</span>
            </>
          )}
        </div>
        <div className="flex flex-row text-black rounded-lg p-3 space-x-2">
          {isEditMode ? (
            <>
              <CheckOutlined
                className="p-2 rounded hover:border border-green-600 cursor-pointer"
                onClick={handleSave}
              />
              <CloseOutlined
                className="p-2 rounded hover:border border-red-600 cursor-pointer"
                onClick={handleCancel}
              />
            </>
          ) : (
            <>
              <EditOutlined
                className="p-2 rounded hover:border border-black cursor-pointer"
                onClick={() => setIsEditMode(true)}
              />
              <DeleteOutlined className="p-2 rounded hover:border border-black cursor-pointer" onClick={() => handleDelete()}/>
            </>
          )}
        </div>
      </div>

      {isEditMode ? (
        <>
          <TextArea
            rows={3}
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            className="mb-2"
          />
          <Select
            value={localStatus}
            onChange={(value) => setLocalStatus(value)}
            className="w-full"
          >
            <Select.Option value="todo">To-Do</Select.Option>
            <Select.Option value="inprogress">In Progress</Select.Option>
            <Select.Option value="done">Done</Select.Option>
          </Select>
        </>
      ) : (
        <>
          <p className="text-gray-600">{localDescription}</p>
          <span className="text-sm mt-4 text-gray-500">{localStatus}</span>
        </>
      )}
    </div>
  );
}


export default Card;

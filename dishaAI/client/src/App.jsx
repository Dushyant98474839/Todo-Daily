import { useState, useEffect } from 'react'
import { PlusSquareTwoTone } from '@ant-design/icons'
import Card from './components/Card.jsx'
import { AddNew } from './components/AddNew.jsx'
import axios from 'axios'


var TodoData = {
  title: "Todo",
  description: "This is a todo <div className=columns flex flex-row items-center justify-center min-w-screendiv className=todo-col flex flex-col flex-1 border-2 border-gray-300 rounded-lg p-4 m-4",
  status: "Todo",
  date: "2023-10-01"
}

function App() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view tasks.');
          return;
        }

        const response = await axios.get('http://localhost:8000/tasks', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('Fetched tasks:', response.data);
        setTasks(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks. Please try again.');
      }
    };
    fetchTasks();
  }
    , []);

  return (
    <>

      <div className="Add fixed top-2 left-1/2 transform -translate-x-1/2 text-4xl z-10">
        <AddNew setTasks={setTasks} />
      </div>

      <div className="columns mt-25 flex flex-row items-center justify-center min-w-screen">
        <div className="todo-col flex flex-col flex-1 border-1 border-gray-300 rounded-lg p-4 m-4">
          <span className="text-4xl font-bold text-center">Todo</span>
          <div className="todo-cards flex flex-col items-center justify-center">
            {tasks.map((task) => {
              if (task.status !== "todo") return null;
                return (
                <Card
                  key={task.id}
                  id={task.uuid}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  date={task.date ? task.date: null}
                  setTasks={setTasks}
                />
                )
            })}
          </div>
        </div>
        <div className="processing-col flex flex-1 flex-col border-1 border-gray-300 rounded-lg p-4 m-4">
          <span className="text-4xl font-bold text-center">In Progress</span>
          <div className="todo-cards flex flex-col items-center justify-center">
            {tasks.map((task) => {
              if (task.status !== "inprogress") return null;
              return (
                <Card
                  key={task.id}
                  id={task.uuid}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  date={task.date ? task.date: null}
                  setTasks={setTasks}
                />
              )
            })}
          </div>
        </div>
        <div className="done-col flex flex-col flex-1 border-1 border-gray-300 rounded-lg p-4 m-4">
          <span className="text-4xl font-bold text-center">Done</span>
          <div className="todo-cards flex flex-col items-center justify-center">
            {tasks.map((task) => {
              if (task.status !== "done") return null;
              return (
                <Card
                  key={task.id}
                  id={task.uuid}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  date={task.date ? task.date: null}
                  setTasks={setTasks}
                />
              )
            })}
          </div>
        </div>

      </div>

    </>
  )
}

export default App

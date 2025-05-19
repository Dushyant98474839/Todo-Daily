import { useState, useEffect } from 'react';
import { PlusSquareTwoTone } from '@ant-design/icons';
import Card from './components/Card.jsx';
import { AddNew } from './components/AddNew.jsx';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view tasks.');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/tasks`, {
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
  }, []);

  // Handle drag-and-drop
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // If no destination or dropped in the same place, do nothing
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    // Find the task being dragged
    const draggedTask = tasks.find((task) => task.uuid === draggableId);
    if (!draggedTask) return;

    // Map droppableId to status
    const statusMap = {
      todo: 'todo',
      inprogress: 'inprogress',
      done: 'done',
    };

    const newStatus = statusMap[destination.droppableId];
    if (!newStatus) return;

    // Optimistically update the frontend state
    const updatedTasks = tasks.map((task) =>
      task.uuid === draggedTask.uuid ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    // Persist the status change to the backend
    try {
      await axios.put(
        `${API_BASE_URL}/tasks/${draggedTask.uuid}`,
        {
          title: draggedTask.title,
          description: draggedTask.description,
          status: newStatus,
          date: draggedTask.date,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('Task status updated:', draggedTask.uuid, newStatus);
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status. Reverting change.');
      // Revert the state if the backend update fails
      setTasks(tasks);
    }
  };

  // Define columns
  const columns = [
    { id: 'todo', title: 'Todo' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="Add fixed top-2 left-1/2 transform -translate-x-1/2 text-4xl z-10">
        <AddNew setTasks={setTasks} />
      </div>

      <div className="columns mt-25 flex flex-row items-start justify-center min-w-screen">
        {columns.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided) => (
              <div
                className={`${column.id}-col flex flex-col flex-1 border-1 border-gray-300 rounded-lg p-4 m-4 min-h-[300px]`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <span className="text-4xl font-bold text-center">{column.title}</span>
                <div className="todo-cards flex flex-col items-center justify-start">
                  {tasks
                    .filter((task) => task.status === column.id)
                    .map((task, index) => (
                      <Draggable key={task.uuid} draggableId={task.uuid} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card
                              id={task.uuid}
                              title={task.title}
                              description={task.description}
                              status={task.status}
                              date={task.date ? task.date : null}
                              setTasks={setTasks}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;
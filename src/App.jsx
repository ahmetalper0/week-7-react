import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const keyDownHandler = (e) => {
       if (e.key === 'Enter') {
         addTask();
       } else if (e.key === 'Escape') {
         setEditingTask(null);
         setEditedTaskText('');
       }
    };
   
    document.addEventListener('keydown', keyDownHandler);
    return () => document.removeEventListener('keydown', keyDownHandler);
   }, [newTask, tasks]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: tasks.length + 1, text: newTask }]);
      setNewTask('');
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const startEditing = (taskId, taskText) => {
    setEditingTask(taskId);
    setEditedTaskText(taskText);
  };

  const saveEditedTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editingTask ? { ...task, text: editedTaskText } : task
    );
    setTasks(updatedTasks);
    setEditingTask(null);
    setEditedTaskText('');
  };

  return (
    <div className="app">
      <div className="container">
        <h1>To-Do App</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            id="newTask"
            name="newTask"
          />
          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {editingTask === task.id ? (
                <>
                  <input
                    type="text"
                    value={editedTaskText}
                    onChange={(e) => setEditedTaskText(e.target.value)}
                    id="editedTask"
                    name="editedTask"
                  />
                  <button className="save-button" onClick={saveEditedTask}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>{task.text}</span>
                  <div>
                    <button className="edit-button" onClick={() => startEditing(task.id, task.text)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => deleteTask(task.id)}>
                      X
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
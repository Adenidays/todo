import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    task_text: '',
    deadline: '',
    user: '',
  });
  const cookies = new Cookies();
  const cookiesRef = useRef(cookies);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = cookiesRef.current.get('token');

        if (!token) {
          console.error('JWT token not found in cookies.');
          return;
        }

        const responseTasks = await fetch('http://127.0.0.1:8000/tasks/', {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (responseTasks.ok) {
          const dataTasks = await responseTasks.json();
          setTasks(dataTasks);
        } else if (responseTasks.status === 401) {
          console.error('Unauthorized request');
        } else {
          console.error('Error fetching tasks:', responseTasks.statusText);
        }

        const responseUsers = await fetch('http://127.0.0.1:8000/api/v1/users/', {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (responseUsers.ok) {
          const dataUsers = await responseUsers.json();
          setUsers(dataUsers);
        } else if (responseUsers.status === 401) {
          console.error('Unauthorized request');
        } else {
          console.error('Error fetching users:', responseUsers.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
      } else {
        console.error('Error deleting task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await fetch(`http://127.0.0.1:8000/tasks/${taskId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
        credentials: 'include',
      });

      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
        credentials: 'include',
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([...tasks, createdTask]);
        setNewTask({ title: '', task_text: '', deadline: '', user: '' });
      } else {
        console.error('Error creating task:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <div>

      <a href='http://localhost:5173/login'>ЛОГ ИН</a>
      <br />
      <a href='http://localhost:5173/reg'>ЗАААРЕЕЕГАТЬ </a>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.task_text}</p>
            <p>User: {task.user}</p>
            <p>Status: {task.status ? 'Completed' : 'Incomplete'}</p>
            <p>Created At: {task.create_at}</p>
            <p>Deadline: {task.deadline}</p>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
            <button onClick={() => handleUpdateStatus(task.id, !task.status)}>
              {task.status ? 'Mark as Incomplete' : 'Mark as Completed'}
            </button>
          </li>
        ))}
      </ul>

      <h2>Create New Task</h2>
      <form>
        <label>Title:</label>
        <input type="text" name="title" value={newTask.title} onChange={handleInputChange} required />

        <label>Task Text:</label>
        <textarea name="task_text" value={newTask.task_text} onChange={handleInputChange} required />

        <label>Deadline:</label>
        <input type="date" name="deadline" value={newTask.deadline} onChange={handleInputChange} required />

        <label>User:</label>
        <select name="user" value={newTask.user} onChange={handleInputChange} required>
          <option value="" disabled>Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleCreateTask}>Create Task</button>
      </form>
    </div>
  );
};

export default TaskList;
import './App.css';
import { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskQuantity from './components/TaskQuantity';
import FilterButton from './components/FilterButton';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "incomplete":
        return tasks.filter((task) => !task.completed);
      case "complete":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <TaskQuantity tasks={tasks} />
      <TaskForm addTask={addTask} />
      <div className='filter-buttons-container'>
        <FilterButton
          label="All Tasks"
          isActive={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterButton
          label="Complete Tasks"
          isActive={filter === "complete"}
          onClick={() => setFilter("complete")}
        />
        <FilterButton
          label="Incomplete Tasks"
          isActive={filter === "incomplete"}
          onClick={() => setFilter("incomplete")}
        />
      </div>
      <TaskList
        tasks={filteredTasks}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
      />
    </div>
  );
}

export default App;

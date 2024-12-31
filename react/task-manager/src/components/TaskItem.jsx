import PropTypes from 'prop-types';

function TaskItem({ task, toggleTaskCompletion, deleteTask }) {
  return (
    <li>
      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.title}
      </span>
      <button onClick={() => toggleTaskCompletion(task.id)}>
        {task.completed ? 'Reset' : 'Complete'}
      </button>
      <button className='delete-button' onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
}

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  toggleTaskCompletion: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired
}

export default TaskItem;

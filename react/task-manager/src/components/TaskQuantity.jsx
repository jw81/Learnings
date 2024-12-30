import PropTypes from "prop-types";

function TaskQuantity({ tasks }) {
  const completedCount = tasks.filter((task) => task.completed).length;
  const incompleteCount = tasks.length - completedCount;

  return (
    <h2>
      {tasks.length === 0
        ? "No tasks yet!"
        : `${tasks.length} total tasks (${completedCount} completed, ${incompleteCount} incomplete)`}
    </h2>
  );
}


TaskQuantity.propTypes = {
  tasks: PropTypes.array.isRequired
}

export default TaskQuantity;
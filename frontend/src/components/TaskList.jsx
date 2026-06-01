const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
};

export default function TaskList({ tasks, isAdmin, onEdit, onDelete }) {
  if (!tasks.length) {
    return <p className="muted">No tasks yet. Create one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className="card task-item">
          <div className="task-header">
            <h4>{task.title}</h4>
            <span className={`badge badge-${task.status}`}>{STATUS_LABELS[task.status]}</span>
          </div>
          {task.description && <p className="task-desc">{task.description}</p>}
          {isAdmin && task.owner && (
            <p className="muted small">
              Owner: {task.owner.name} ({task.owner.email})
            </p>
          )}
          <div className="task-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

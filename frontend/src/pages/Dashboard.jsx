import { useCallback, useEffect, useState } from 'react';
import Alert from '../components/Alert';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { taskApi, userApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    const res = await taskApi.list();
    setTasks(res.data.tasks);
  }, []);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    const res = await userApi.list();
    setUsers(res.data.users);
  }, [isAdmin]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadTasks(), loadUsers()]);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [loadTasks, loadUsers]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCreate = async (payload) => {
    setError('');
    setSuccess('');
    try {
      await taskApi.create(payload);
      setSuccess('Task created');
      await loadTasks();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;
    setError('');
    setSuccess('');
    try {
      await taskApi.update(editing._id, payload);
      setSuccess('Task updated');
      setEditing(null);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    setError('');
    setSuccess('');
    try {
      await taskApi.remove(id);
      setSuccess('Task deleted');
      if (editing?._id === id) setEditing(null);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleChange = async (userId, role) => {
    setError('');
    setSuccess('');
    try {
      await userApi.updateRole(userId, role);
      setSuccess('User role updated');
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p className="muted">
            Welcome, {user.name}. Role: <strong>{user.role}</strong>
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={refresh}>
          Refresh
        </button>
      </header>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {loading ? (
        <p className="muted">Loading tasks…</p>
      ) : (
        <div className="dashboard-grid">
          <div>
            {!editing ? (
              <TaskForm onSubmit={handleCreate} submitLabel="Create task" />
            ) : (
              <TaskForm
                initial={editing}
                onSubmit={handleUpdate}
                submitLabel="Update task"
              />
            )}
            {editing && (
              <button type="button" className="btn btn-ghost btn-sm cancel-edit" onClick={() => setEditing(null)}>
                Cancel edit
              </button>
            )}
          </div>
          <div>
            <h3>Your tasks{isAdmin ? ' (all users)' : ''}</h3>
            <TaskList
              tasks={tasks}
              isAdmin={isAdmin}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      {isAdmin && (
        <section className="admin-panel card">
          <h3>Users (admin)</h3>
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      disabled={u.id === user.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>{u.isActive ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </section>
  );
}

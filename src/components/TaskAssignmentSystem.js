import { useState, useEffect } from 'react';
import './TaskAssignmentSystem.css';

function TaskAssignmentSystem() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'TERM WORK SUBMISSION', assignee: 'SIDDHI MAM', status: 'Done', priority: 'High' },
    { id: 2, title: 'IP PRESENTATION', assignee: 'SUDHIR SIR', status: 'Done', priority: 'Medium' },
    { id: 3, title: 'FORMATIVE ASSESMENT 1', assignee: 'AKSHATA MAM', status: 'In Progress', priority: 'Low' },
    { id: 4, title: 'FORMATIVE ASSESMENT 2', assignee: 'SOUMYA MAM', status: 'In Review', priority: 'Medium' },
  ]);

  const [newTask, setNewTask] = useState({ title: '', assignee: '', status: 'To Do', priority: 'Medium' });
  const [filter, setFilter] = useState('All');
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [konami, setKonami] = useState([]);
  const [secretMode, setSecretMode] = useState(false);
  const [secretModalOpen, setSecretModalOpen] = useState(false);
  const [secretMessage, setSecretMessage] = useState('');

  // Easter Egg: Konami Code (up, up, down, down, left, right, left, right, b, a)
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKonami((prevCode) => {
        const updatedCode = [...prevCode, e.key];
        if (updatedCode.length > konamiCode.length) {
          updatedCode.shift();
        }
        
        if (updatedCode.length === konamiCode.length && 
            updatedCode.every((key, i) => key === konamiCode[i])) {
          setEasterEggActive(true);
          setTimeout(() => setEasterEggActive(false), 5000);
        }
        
        return updatedCode;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Easter Egg: Enter "secretmode" in the title field
  useEffect(() => {
    if (newTask.title.toLowerCase().replace(/\s/g, '') === 'secretmode') {
      setSecretMode(true);
      setNewTask({ ...newTask, title: '' });
      setSecretModalOpen(true);
    }
  }, [newTask.title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignee) return;
    
    const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    setTasks([...tasks, { ...newTask, id: newId }]);
    setNewTask({ title: '', assignee: '', status: 'To Do', priority: 'Medium' });
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const filteredTasks = filter === 'All' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const submitSecretMessage = () => {
    if (secretMessage.toLowerCase() === 'coffee break') {
      // Second-level Easter egg
      alert('🎉 You found the super secret Easter egg! Everyone gets coffee! ☕☕☕');
    }
    setSecretModalOpen(false);
    setSecretMessage('');
  };

  return (
    <div className={`task-system-container ${secretMode ? 'secret-mode' : ''}`}>
      <header className="header">
        <h1 className="title">
          TASK ASSIGNMENT SYSTEM
          {secretMode && <span className="secret-badge">✨ Secret Mode ✨</span>}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter task title"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Assignee</label>
            <input
              type="text"
              name="assignee"
              value={newTask.assignee}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter assignee name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={newTask.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        <button type="submit" className="submit-button">
          Add Task
        </button>
      </form>

      <div className="filter-container">
        <label className="form-label">Filter by Status</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Tasks</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="In Review">In Review</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.assignee}</td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
                <td>
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {secretModalOpen && (
        <div className="secret-modal-overlay">
          <div className="secret-modal">
            <h2 className="secret-modal-title">🔮 Secret Mode Activated!</h2>
            <p>You've discovered the secret mode! Enter the magic phrase to unlock the super secret Easter egg:</p>
            <input
              type="text"
              value={secretMessage}
              onChange={(e) => setSecretMessage(e.target.value)}
              className="secret-modal-input"
              placeholder="Enter the magic phrase..."
            />
            <div className="modal-button-container">
              <button
                onClick={() => setSecretModalOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={submitSecretMessage}
                className="submit-modal-button"
              >
                Submit
              </button>
            </div>
            <div className="hint-text">
              <p>Hint: What does every developer need after a long coding session?</p>
            </div>
          </div>
        </div>
      )}

      {easterEggActive && (
        <div className="konami-overlay">
          <div className="konami-content">
            <h2 className="konami-title">🎮 KONAMI CODE ACTIVATED! 🎮</h2>
            <p className="konami-subtitle">You found the Easter egg! 🎉</p>
            <div className="konami-emoji">🥚</div>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default TaskAssignmentSystem;


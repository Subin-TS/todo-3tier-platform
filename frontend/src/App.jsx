import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = "/api";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTodos = async () => {
    try {
      setError("");

      const response = await fetch(`${API}/todos`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load tasks");
      }

      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;

    return {
      total: todos.length,
      active: todos.length - completed,
      completed,
    };
  }, [todos]);

  const addTodo = async (event) => {
    event.preventDefault();

    if (!title.trim() || saving) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to create task");
      }

      setTitle("");
      setDescription("");
      await loadTodos();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      setError("");

      const response = await fetch(`${API}/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update task");
      }

      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError("");

      const response = await fetch(`${API}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete task");
      }

      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">✓</div>

          <div>
            <div className="brand-name">TaskFlow v2</div>
            <div className="brand-subtitle">Todo Manager</div>
          </div>
        </div>

        <div className="environment-badge">
          <span className="status-dot"></span>
          Live
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">PERSONAL WORKSPACE</p>
            <h1>Stay organized.<br />Get things done.</h1>
            <p className="hero-text">
              Manage your tasks, track your progress, and keep your day moving.
            </p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total-icon">◎</div>
            <div>
              <p>Total Tasks</p>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active-icon">◷</div>
            <div>
              <p>Active</p>
              <strong>{stats.active}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed-icon">✓</div>
            <div>
              <p>Completed</p>
              <strong>{stats.completed}</strong>
            </div>
          </div>
        </section>

        <section className="create-card">
          <div className="section-heading">
            <div>
              <p className="section-label">NEW TASK</p>
              <h2>Add something to your list</h2>
            </div>
          </div>

          <form onSubmit={addTodo} className="todo-form">
            <div className="input-group">
              <label htmlFor="title">Task title</label>
              <input
                id="title"
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
              />
            </div>

            <div className="input-group">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                placeholder="Add a little more detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
              />
            </div>

            <button className="add-button" type="submit" disabled={!title.trim() || saving}>
              <span>+</span>
              {saving ? "Adding..." : "Add Task"}
            </button>
          </form>
        </section>

        {error && (
          <div className="error-message" role="alert">
            <span>!</span>
            {error}
          </div>
        )}

        <section className="tasks-section">
          <div className="tasks-header">
            <div>
              <p className="section-label">TASK LIST</p>
              <h2>Your Tasks</h2>
            </div>

            <span className="task-count">
              {stats.active} active
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="loading-spinner"></div>
              <p>Loading your tasks...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>Your task list is empty</h3>
              <p>Add your first task above and start getting things done.</p>
            </div>
          ) : (
            <div className="todo-list">
              {todos.map((todo) => (
                <article
                  key={todo.id}
                  className={`todo-card ${todo.completed ? "is-completed" : ""}`}
                >
                  <button
                    className="check-button"
                    onClick={() => toggleTodo(todo)}
                    aria-label={
                      todo.completed
                        ? `Mark ${todo.title} as active`
                        : `Mark ${todo.title} as completed`
                    }
                  >
                    {todo.completed ? "✓" : ""}
                  </button>

                  <div className="todo-content">
                    <h3>{todo.title}</h3>

                    {todo.description && (
                      <p>{todo.description}</p>
                    )}

                    <span className={`todo-status ${todo.completed ? "done" : "pending"}`}>
                      {todo.completed ? "Completed" : "In progress"}
                    </span>
                  </div>

                  <button
                    className="delete-button"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label={`Delete ${todo.title}`}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <span>TaskFlow</span>
        <span>•</span>
        <span>Todo Management Platform</span>
      </footer>
    </div>
  );
}

export default App;

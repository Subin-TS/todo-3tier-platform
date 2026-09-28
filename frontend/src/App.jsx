import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadTodos = async () => {
    const response = await fetch(`${API}/todos` ,{
      cache: "no-store",
    });
    const data = await response.json();
    setTodos(data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();

    if (!title.trim()) return;

    await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    setTitle("");
    setDescription("");
    loadTodos();
  };

  const toggleTodo = async (todo) => {
    await fetch(`${API}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });

    loadTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, {
      method: "DELETE",
    });

    loadTodos();
  };

  return (
    <main>
      <h1>Todo App</h1>

      <form onSubmit={addTodo}>
        <input
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Todo</button>
      </form>

      <section>
        {todos.map((todo) => (
          <article key={todo.id}>
            <h2>{todo.title}</h2>
            <p>{todo.description}</p>

            <button onClick={() => toggleTodo(todo)}>
              {todo.completed ? "Completed" : "Mark Complete"}
            </button>

            <button onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;

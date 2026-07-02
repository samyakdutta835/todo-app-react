import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Load todos
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));

    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  // Save todos
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (task.trim() === "") return;

    if (editId !== null) {
      setTodos(
        todos.map((todo) =>
          todo.id === editId ? { ...todo, text: task } : todo
        )
      );

      setEditId(null);
      setTask("");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTask("");
  }

  function toggleCompleted(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));

    if (editId === id) {
      setEditId(null);
      setTask("");
    }
  }

  function editTodo(todo) {
    setTask(todo.text);
    setEditId(todo.id);
  }

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "completed")
      return todo.completed && matchesSearch;

    if (filter === "active")
      return !todo.completed && matchesSearch;

    return matchesSearch;
  });

  const completed = todos.filter((todo) => todo.completed).length;
  const remaining = todos.length - completed;

  return (
    <div className="container">

      <h1>📝 My Todo App</h1>

      <p className="subtitle">
        Stay organized every day
      </p>

      <div className="stats">

        <div className="card">
          <h2>{todos.length}</h2>
          <p>Total</p>
        </div>

        <div className="card">
          <h2>{completed}</h2>
          <p>Completed</p>
        </div>

        <div className="card">
          <h2>{remaining}</h2>
          <p>Remaining</p>
        </div>

      </div>

      <div className="inputBox">

        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
        />

        <button
          className="addBtn"
          onClick={addTodo}
        >
          {editId ? "Update" : "Add"}
        </button>

      </div>

      <input
        className="search"
        type="text"
        placeholder="🔍 Search task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">

        <button
          className={filter === "all" ? "activeFilter" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "active" ? "activeFilter" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>

        <button
          className={filter === "completed" ? "activeFilter" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

      </div>

      {filteredTodos.length === 0 ? (
        <div className="empty">

          <h2>📋</h2>

          <p>No tasks found.</p>

        </div>
      ) : (
        filteredTodos.map((todo) => (
          <div
            className="todo"
            key={todo.id}
          >
            <h3
              className={
                todo.completed
                  ? "completed"
                  : ""
              }
            >
              {todo.text}
            </h3>

            <div className="buttons">

              <button
                className="completeBtn"
                onClick={() =>
                  toggleCompleted(todo.id)
                }
              >
                {todo.completed
                  ? "Undo"
                  : "Complete"}
              </button>

              <button
                className="editBtn"
                onClick={() =>
                  editTodo(todo)
                }
              >
                Edit
              </button>

              <button
                className="deleteBtn"
                onClick={() =>
                  deleteTodo(todo.id)
                }
              >
                Delete
              </button>

            </div>
          </div>
        ))
      )}

    </div>
  );
}

export default App;
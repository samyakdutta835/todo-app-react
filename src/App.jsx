import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Load Todos
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos"));

    if (saved) {
      setTodos(saved);
    }
  }, []);

  // Save Todos
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add / Update Task
  function addTodo() {
    if (!task.trim()) return;

    if (editId !== null) {
      setTodos(
        todos.map((todo) =>
          todo.id === editId
            ? { ...todo, text: task }
            : todo
        )
      );

      setTask("");
      setEditId(null);
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: task,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    setTodos([...todos, newTodo]);

    setTask("");
  }

  // Complete Task
  function toggleCompleted(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
            ...todo,
            completed: !todo.completed,
          }
          : todo
      )
    );
  }

  // Delete Task
  function deleteTodo(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    setTodos(
      todos.filter((todo) => todo.id !== id)
    );
  }

  // Edit
  function editTodo(todo) {
    setTask(todo.text);
    setEditId(todo.id);
  }

  // Clear Completed
  function clearCompleted() {
    const completedTasks = todos.filter(
      (todo) => todo.completed
    );

    if (completedTasks.length === 0) return;

    const confirmClear = window.confirm(
      "Delete all completed tasks?"
    );

    if (!confirmClear) return;

    setTodos(
      todos.filter((todo) => !todo.completed)
    );
  }

  // Search + Filter
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

  // Statistics
  const total = todos.length;

  const completed = todos.filter(
    (todo) => todo.completed
  ).length;

  const remaining = total - completed;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <div className="container">

      <h1>📝 TaskFlow</h1>

      <p className="subtitle">
        Stay organized. Stay productive.
      </p>

      {/* Statistics */}

      <div className="stats">

        <div className="card">
          <h2>{total}</h2>
          <span>Total</span>
        </div>

        <div className="card">
          <h2>{completed}</h2>
          <span>Completed</span>
        </div>

        <div className="card">
          <h2>{remaining}</h2>
          <span>Remaining</span>
        </div>

      </div>

      {/* Progress */}

      <div className="progressSection">

        <div className="progressText">

          <span>Progress</span>

          <span>{progress}%</span>

        </div>

        <div className="progressBar">

          <div
            className="progress"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

      </div>

      {/* Input */}

      <div className="inputBox">

        <input
          type="text"
          placeholder="What would you like to accomplish today?"
          value={task}
          onChange={(e) =>
            setTask(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter")
              addTodo();
          }}
        />

        <button
          className="addBtn"
          disabled={!task.trim()}
          onClick={addTodo}
        >
          {editId ? "Update" : "Add"}
        </button>

      </div>

      {/* Search */}

      <input
        className="search"
        type="text"
        placeholder="🔍 Search task..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* Filters */}

      <div className="filters">

        <button
          className={
            filter === "all"
              ? "activeFilter"
              : ""
          }
          onClick={() =>
            setFilter("all")
          }
        >
          All
        </button>

        <button
          className={
            filter === "active"
              ? "activeFilter"
              : ""
          }
          onClick={() =>
            setFilter("active")
          }
        >
          Active
        </button>

        <button
          className={
            filter === "completed"
              ? "activeFilter"
              : ""
          }
          onClick={() =>
            setFilter("completed")
          }
        >
          Completed
        </button>

      </div>

      {/* Todo List */}

      {filteredTodos.length === 0 ? (
        <div className="empty">
          <h2>📋</h2>

          <h3>No Tasks Found</h3>

          <p>
            Start by adding your first task.
          </p>
        </div>
      ) : (
        filteredTodos.map((todo) => (
          <div
            className={`todo ${todo.completed ? "done" : ""
              }`}
            key={todo.id}
          >
            <div className="todoContent">

              <h3>{todo.text}</h3>

              <small>
                Created: {todo.createdAt}
              </small>

            </div>

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

      {/* Clear Completed */}

      {completed > 0 && (

        <div className="clearSection">

          <button
            className="clearBtn"
            onClick={clearCompleted}
          >
            Clear Completed
          </button>

        </div>

      )}

      {/* Footer */}

      <footer>

        <p>
          Built with ❤️ using React
        </p>

      </footer>

    </div>
  );
}

export default App;
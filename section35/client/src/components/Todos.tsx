import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";

import styles from "./Todos.module.css";

interface Todo {
  _id: string;
  text: string;
}

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const [enteredText, setEnteredText] = useState<string>("");

  const getTodos = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/todos");
      const todosData = await response.json();
      setTodos(todosData.data.documents);
    } catch (err) {
      // Error handling would be implemented here
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getTodos();
  }, [getTodos]);

  useEffect(() => {
    if (editedTodo) {
      setEnteredText(editedTodo.text);
    }
  }, [editedTodo]);

  const startEditHandler = (todo: Todo) => {
    setEditedTodo(todo);
  };

  const deleteTodoHandler = async (todoId: string) => {
    const response = await fetch("http://localhost:8080/todos/" + todoId, {
      method: "DELETE",
    });
    await response.json();
    getTodos();
  };

  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredText(event.target.value);
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditedTodo(null);
    setEnteredText("");
    let url = "http://localhost:8080/todos";
    let method = "POST";
    if (editedTodo) {
      url = url + "/" + editedTodo._id;
      method = "PUT";
    }
    const response = await fetch(url, {
      method,
      body: JSON.stringify({
        text: enteredText,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await response.json();
    getTodos();
  };

  return (
    <>
      <div className={styles["todos__form"]}>
        <form onSubmit={submitHandler}>
          <label>Todo Text</label>
          <input type="text" value={enteredText} onChange={inputHandler} />
          <button type="submit">{editedTodo ? "Edit" : "Add"} Todo</button>
        </form>
      </div>
      {todos && todos.length > 0 && (
        <ul className={styles["todos__list"]}>
          {todos.map((todo) => (
            <li key={todo._id}>
              <span>{todo.text}</span>
              <div className={styles["todo__actions"]}>
                <button onClick={startEditHandler.bind(null, todo)}>
                  Edit
                </button>
                <button onClick={deleteTodoHandler.bind(null, todo._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Todos;

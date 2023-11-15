import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { addTodo, getTodos } from "../controllers/todo.ts";

interface Todo {
  id: string;
  text: string;
}

const router = new Router();

const todos: Todo[] = [];

/* router.get("/todos", (ctx) => {
  ctx.response.body = { todos };
}); */

router.get("/todos", getTodos);

/* router.post("/todos", async (ctx) => {
  const data = await ctx.request.body().value;
  const newTodo: Todo = {
    id: Date.now().toString(),
    text: data.text ? data.text : "empty",
  };
  todos.push(newTodo);
  ctx.response.body = { message: "Created new todo task", todo: newTodo };
}); */

router.post("/todos", addTodo);

router.put("/todos/:todoId", async (ctx) => {
  const tid = ctx.params.todoId;
  const todoIndex = todos.findIndex((todo) => {
    return todo.id === tid;
  });
  if (todoIndex >= 0) {
    const data = await ctx.request.body().value;
    todos[todoIndex] = {
      ...todos[todoIndex],
      text: data.text ? data.text : "empty",
    };
    ctx.response.body = {
      message: `Updated todo task ${tid}`,
      todo: todos[todoIndex],
    };
  } else {
    ctx.response.body = {
      message: "Task id not found",
    };
  }
});

router.delete("/todos/:todoId", (ctx) => {
  const tid = ctx.params.todoId;
  const todoIndex = todos.findIndex((todo) => {
    return todo.id === tid;
  });
  if (todoIndex >= 0) {
    todos.splice(todoIndex, 1);
    ctx.response.body = {
      message: `Deleted todo task ${tid}`,
    };
  } else {
    ctx.response.body = {
      message: "Task id not found",
    };
  }
});

export default router;

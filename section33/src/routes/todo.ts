import { Router } from "express";
import { Todo } from "../models/todo";

const todos: Todo[] = [];

const router = Router();

type RequestBody = {
  text: string;
};

type RequestParams = {
  todoId: string;
};

router.get("/", (req, res, next) => {
  res.status(200).json({ todos });
});

router.post("/todo", (req, res, next) => {
  const body = req.body as RequestBody;
  const newTodo: Todo = {
    id: Date.now().toString(),
    text: body.text,
  };

  todos.push(newTodo);
  return res
    .status(201)
    .json({ message: "added todo item", todo: newTodo, todos });
});

router.put("/todo/:todoId", (req, res, next) => {
  const param = req.params as RequestParams;
  const tid = param.todoId;
  const body = req.body as RequestBody;
  const todoIndex = todos.findIndex((todoItem) => {
    return todoItem.id === tid;
  });
  console.log(tid, todoIndex);
  if (todoIndex < 0)
    return res.status(404).json({ message: "todo item not found" });
  todos[todoIndex] = { ...todos[todoIndex], text: body.text };
  return res.status(200).json({ message: "updated todo item", todos });
});

router.delete("/todo/:todoId", (req, res, next) => {
  const param = req.params as RequestParams;
  const tid = param.todoId;
  const todoIndex = todos.findIndex((todoItem) => {
    return todoItem.id === tid;
  });
  if (todoIndex < 0)
    return res.status(404).json({ message: "todo item not found" });
  todos.splice(todoIndex, 1);
  return res.status(200).json({ message: "deleted todo item", todos });
});

export default router;

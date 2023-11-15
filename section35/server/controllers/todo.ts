import { load } from "https://deno.land/std@0.206.0/dotenv/mod.ts";
import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const env = await load();

const BASE_URI = `https://eu-central-1.aws.data.mongodb-api.com/app/${env["APP_ID"]}/endpoint/data/v1/action`;
const DATA_SOURCE = "Cluster0";
const DATABASE = "todo-app";
const COLLECTION = "todos";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": env["DATA_API_KEY"],
  },
  body: "",
};

export const addTodo = async (ctx: Context, next: Next) => {
  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const body = await ctx.request.body();
      const todo = await body.value;
      const URI = `${BASE_URI}/insertOne`;
      const query = {
        collection: COLLECTION,
        database: DATABASE,
        dataSource: DATA_SOURCE,
        document: todo,
      };
      options.body = JSON.stringify(query);
      const dataResponse = await fetch(URI, options);
      const { insertedId } = await dataResponse.json();
      ctx.response.status = 201;
      ctx.response.body = {
        success: true,
        data: todo,
        insertedId,
      };
    }
  } catch (err) {
    ctx.response.body = {
      success: false,
      msg: err.toString(),
    };
  }
  await next();
};

export const getTodos = async (ctx: Context, next: Next) => {
  try {
    const URI = `${BASE_URI}/find`;
    const query = {
      collection: COLLECTION,
      database: DATABASE,
      dataSource: DATA_SOURCE,
    };
    options.body = JSON.stringify(query);
    const dataResponse = await fetch(URI, options);
    const allTodos = await dataResponse.json();
    if (allTodos) {
      ctx.response.status = 200;
      ctx.response.body = {
        success: true,
        data: allTodos,
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        msg: "Internal Server Error",
      };
    }
  } catch (err) {
    ctx.response.body = {
      success: false,
      msg: err.toString(),
    };
  }
  await next();
};

export const updateTodo = async (ctx: Context, next: Next) => {
  try {
    const body = ctx.request.body();
    const { text } = await body.value;
    const URI = `${BASE_URI}/updateOne`;
    const query = {
      collection: COLLECTION,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      //@ts-ignore // params exists in ctx
      filter: { _id: { $oid: ctx.params.todoId } },
      update: { $set: { text } },
    };
    options.body = JSON.stringify(query);
    const dataResponse = await fetch(URI, options);
    const todoUpdated = await dataResponse.json();

    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      todoUpdated,
    };
  } catch (err) {
    ctx.response.body = {
      success: false,
      msg: err.toString(),
    };
  }
  await next();
};

export const deleteTodo = async (ctx: Context, next: Next) => {
  try {
    const URI = `${BASE_URI}/deleteOne`;
    console.log(ctx);
    const query = {
      collection: COLLECTION,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      //@ts-ignore // params exists in ctx
      filter: { _id: { $oid: ctx.params.todoId } },
    };
    options.body = JSON.stringify(query);
    const dataResponse = await fetch(URI, options);
    const todoDeleted = await dataResponse.json();

    ctx.response.status = 201;
    ctx.response.body = {
      todoDeleted,
    };
  } catch (err) {
    ctx.response.body = {
      success: false,
      msg: err.toString(),
    };
  }
  await next();
};

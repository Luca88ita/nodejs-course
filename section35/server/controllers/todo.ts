import { load } from "https://deno.land/std@0.206.0/dotenv/mod.ts";

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

export const addTodo = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const body = await request.body();
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
      response.status = 201;
      response.body = {
        success: true,
        data: todo,
        insertedId,
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

export const getTodos = async ({ response }: { response: any }) => {
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
      response.status = 200;
      response.body = {
        success: true,
        data: allTodos,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Internal Server Error",
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

export const updateTodo = async ({
  params,
  request,
  response,
}: {
  params: { todoId: string };
  request: any;
  response: any;
}) => {
  try {
    const body = await request.body();
    const { text } = await body.value;
    console.log(text, params.todoId);
    const URI = `${BASE_URI}/updateOne`;
    const query = {
      collection: COLLECTION,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: { _id: { $oid: params.todoId } },
      update: { $set: { text } },
    };
    options.body = JSON.stringify(query);
    console.log(query);
    const dataResponse = await fetch(URI, options);
    const todoUpdated = await dataResponse.json();

    response.status = 200;
    response.body = {
      success: true,
      todoUpdated,
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

export const deleteTodo = async ({
  params,
  response,
}: {
  params: { todoId: string };
  response: any;
}) => {
  try {
    const URI = `${BASE_URI}/deleteOne`;
    const query = {
      collection: COLLECTION,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: { _id: { $oid: params.todoId } },
    };
    options.body = JSON.stringify(query);
    const dataResponse = await fetch(URI, options);
    const todoDeleted = await dataResponse.json();

    response.status = 201;
    response.body = {
      todoDeleted,
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

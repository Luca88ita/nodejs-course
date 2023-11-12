/* const text = "Prova";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const data = encoder.encode(text);

Deno.writeFile("message.txt", data).then(() => console.log("message saved"));

Deno.readFile("message.txt").then((res) => console.log(decoder.decode(res)));
 */

/* Deno.serve({ port: 8080 }, (_req) => {
  return new Response("Hello, World!");
});
 */

import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import todoRoutes from "./routes/todos.ts";

const app = new Application();

app.use(async (_ctx, next) => {
  console.log(
    "This fake middleware MUST be async for being used correctly with all the following ones, and the next must be awaited"
  );
  await next();
});

app.use(async (ctx, next) => {
  ctx.response.headers.set(
    "Access-Control-Allow-Origin",
    "*" //"http://localhost:3000"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

app.use(todoRoutes.routes());
app.use(todoRoutes.allowedMethods());

await app.listen({ port: 8080 });

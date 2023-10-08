const fs = require("fs");
import { IncomingMessage, ServerResponse } from "http";

const users = ["user1", "user2", "user3", "user4", "user5"];

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  switch (url) {
    case "/":
      res.write("<html>");
      res.write("<head><title>Homepage</title></head>");
      res.write(
        "<body><form action='/create-user' method='POST'><input type='text' name='username'><button type='submit'>Send</button></form></body>"
      );
      res.write("</html>");
      return res.end();
    case "/users":
      res.write("<html>");
      res.write("<head><title>User list</title></head>");
      res.write("<body><h1>Users:</h1><ul>");
      users.forEach((user) => {
        res.write(`<li>${user}</li>`);
      });
      res.write("</ul></body>");
      res.write("</html>");
      return res.end();
    case "/create-user":
      if (method === "POST") {
        const body: any[] = [];
        req.on("data", (chunk) => {
          body.push(chunk);
        });
        return req.on("end", () => {
          const parsedBody = Buffer.concat(body).toString();
          const message = parsedBody.split("=")[1];
          console.log(`The inserted username is ${message}`);
          res.statusCode = 302;
          res.setHeader("Location", "/");
          return res.end();
        });
      }
      break;
    default:
      res.write("<html>");
      res.write("<head><title>404 - Page not found</title></head>");
      res.write("<body><h1>404 - Page not found</h1></body>");
      res.write("</html>");
      res.end();
      break;
  }
};

module.exports = {
  handler: requestHandler,
};

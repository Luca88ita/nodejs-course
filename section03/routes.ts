const fs = require("fs");
import { IncomingMessage, ServerResponse } from "http";

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  switch (url) {
    case "/":
      res.write("<html>");
      res.write("<head><title>Homepage</title></head>");
      res.write(
        "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
      );
      res.write("</html>");
      return res.end();
    case "/message":
      if (method === "POST") {
        const body: any[] = [];
        req.on("data", (chunk) => {
          body.push(chunk);
        });
        return req.on("end", () => {
          const parsedBody = Buffer.concat(body).toString();
          const message = parsedBody.split("=")[1];
          fs.writeFile("message.txt", message, (err: any) => {
            res.statusCode = 302;
            res.setHeader("Location", "/");
            return res.end();
          });
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
  someText: "Fake code",
};

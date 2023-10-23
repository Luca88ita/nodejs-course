import fs from "fs";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import mainPath from "./path";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export const sendEmail = async (
  email: string,
  from: string,
  subject: string,
  htmlFileName: string,
  url?: string
) => {
  const filePath = path.join(
    mainPath as string,
    `./templates/email/${htmlFileName}.hbs`
  );
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  const replacements = {
    email,
    url,
  };
  const htmlToSend = template(replacements);

  const mailOptions = {
    from,
    to: email,
    subject: subject,
    html: htmlToSend,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", "https://mailtrap.io/inboxes/test/messages/");
};

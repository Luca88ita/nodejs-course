import { IUser } from "../../section14/models/user";

export {};

declare module "express-session" {
  export interface SessionData {
    user: IUser;
    isLoggedIn: boolean;
  }
}

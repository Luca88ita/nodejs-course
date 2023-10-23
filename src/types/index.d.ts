import { IUser } from "../../section15-18/models/user"; // "../../section14/models/user"

export {};

declare module "express-session" {
  export interface SessionData {
    user: IUser;
    isLoggedIn: boolean;
  }
}

declare module "csrf-csrf" {
  export interface DoubleCsrfConfigOptions {
    secret: string;
  }
}

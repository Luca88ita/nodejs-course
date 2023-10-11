import User from "../../models/user";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

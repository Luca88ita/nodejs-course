import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Utils from "../utils/utils";

type UserInputData = {
  email: string;
  name: string;
  password: string;
};
export const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find();
      if (users.length < 0)
        Utils.throwNewError("No users in the database", 422);
      return users;
    },
  },

  Mutation: {
    createUser: async (_, { userInput }, req) => {
      const ui: UserInputData = userInput;
      const email = ui.email;
      const existingUser = await User.findOne({ email });
      if (existingUser)
        Utils.throwNewError("An user with that email already exists", 422);
      const password = await bcrypt.hash(ui.password, 12);
      const name = ui.name;
      const user = new User({ email, name, password });
      const createdUser = await user.save();
      return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
  },
};

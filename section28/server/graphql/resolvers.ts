import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/user";
import Utils from "../utils/utils";
import { GraphQLError } from "graphql";

type UserInputData = {
  email: string;
  name: string;
  password: string;
};

type Arguments = {
  userInput: UserInputData;
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
    createUser: async (_, { userInput }: Arguments) => {
      const errors = [];
      if (!validator.isEmail(userInput.email))
        errors.push({ message: "Invalid e-mail" });
      if (
        validator.isEmpty(userInput.password) ||
        //validator.trim(userInput.password) ||
        !validator.isLength(userInput.password, { min: 8, max: 20 })
      )
        errors.push({ message: "Password is too short (8-20)" });
      if (validator.isEmpty(userInput.name))
        errors.push({ message: "Invalid name" });
      if (errors.length > 0)
        throw new GraphQLError(errors[0].message, {
          extensions: { code: 422, errors },
        });
      const email = userInput.email;
      const existingUser = await User.findOne({ email });
      if (existingUser)
        throw new GraphQLError("An user with that email already exists", {
          extensions: { code: 422, errors },
        });
      const password = await bcrypt.hash(userInput.password, 12);
      const name = userInput.name;
      const user = new User({ email, name, password });
      const createdUser = await user.save();
      return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
  },
};

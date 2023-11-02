import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/user";
import Utils from "../utils/utils";
import { GraphQLError } from "graphql";
import { email } from "../../client/src/util/validators";

type UserInputData = {
  email: string;
  name?: string;
  password: string;
};

type AuthData = {
  token: string;
  userId: string;
};

type Arguments = {
  userInput?: UserInputData;
  authData?: AuthData;
  email?: string;
  password?: string;
};

export const resolvers = {
  Query: {
    login: async (_, { email, password }: Arguments) => {
      const errors = [];
      if (!validator.isEmail(email)) errors.push({ message: "Invalid e-mail" });
      if (
        validator.isEmpty(password) ||
        //validator.trim(userInput.password) ||
        !validator.isLength(password, { min: 8, max: 20 })
      )
        errors.push({ message: "Password is too short (8-20)" });
      if (errors.length > 0)
        throw new GraphQLError(errors[0].message, {
          extensions: { code: 422, errors },
        });

      const user = await User.findOne({ email });
      if (!user)
        throw new GraphQLError("An user with that email doesn't exists", {
          extensions: { code: 401, errors },
        });
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual)
        throw new GraphQLError("Invalid username/password combination", {
          extensions: { code: 401, errors },
        });
      const userId = user._id.toString();
      const token = jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      return { token, userId };
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

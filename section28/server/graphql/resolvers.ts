import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/user";
import Utils from "../utils/utils"; // if removed ts error... why????
import { GraphQLError } from "graphql";
import { UserArguments, PostArguments } from "./types";
import Post from "../models/post";

/* dotenv.config(); */

export const resolvers = {
  Query: {
    login: async (_, { email, password }: UserArguments) => {
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
      console.log(token);
      return { token, userId };
    },

    fetchPosts: async (_, { currentPage, postPerPage }) => {
      const errors = [];
      const totalItems = await Post.find().countDocuments();
      if (totalItems === 0)
        throw new GraphQLError("There are no posts", {
          extensions: { code: 404, errors },
        });
      const posts = await Post.find()
        .populate("creator", "name")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * postPerPage)
        .limit(postPerPage);
      console.log(posts);
      return { posts, totalItems };
    },
  },

  Mutation: {
    createUser: async (_, { userInput }: UserArguments) => {
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

    createPost: async (_, { postInput }: PostArguments, { dataSources }) => {
      const errors = [];
      console.log(dataSources.isAuth);
      if (!dataSources.isAuth)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: 403, errors },
        });
      if (
        validator.isEmpty(postInput.title) ||
        !validator.isLength(postInput.title, { min: 5, max: 80 })
      )
        errors.push({ message: "The title is too short or too long (5-80)" });
      if (
        validator.isEmpty(postInput.content) ||
        !validator.isLength(postInput.content, { min: 5, max: 200 })
      )
        errors.push({
          message: "The content is too short or too long (5-200)",
        });
      /*if (
        validator.isEmpty(postInput.imageUrl) ||
        !validator.isURL(postInput.imageUrl)
      )
        errors.push({ message: "Invalid image url" });*/
      if (errors.length > 0)
        throw new GraphQLError(errors[0].message, {
          extensions: { code: 422, errors },
        });
      const userId = dataSources.userId;
      const user = await User.findById(userId);
      if (!user)
        throw new GraphQLError("Impossible to fetch the user", {
          extensions: { code: 422, errors },
        });
      const title = postInput.title;
      const content = postInput.content;
      const imageUrl =
        /* postInput.imageUrl */ "images/cf2beaf2-1d48-42df-a09e-74ddb30fc51e - Book.png";
      const post = new Post({ title, content, imageUrl, creator: user._id });
      const createdPost = await post.save();
      createdPost.populate("creator", "name");
      user.posts.push(createdPost);
      await user.save();
      return { ...createdPost._doc, _id: createdPost._id.toString() };
    },
  },
};

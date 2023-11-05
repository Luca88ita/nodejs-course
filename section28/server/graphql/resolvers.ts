import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/user";
//import Utils from "../utils/utils"; // if removed ts error... why????
import { GraphQLError } from "graphql";
import { UserArguments, PostArguments } from "./types";
import Post from "../models/post";
import { userId } from "../../../section15-19/app";
import Utils from "../utils/utils";

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
      //console.log(token);
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
      //console.log(posts);
      return { posts, totalItems };
    },

    viewPost: async (_, { postId }, { dataSources }) => {
      const errors = [];
      if (!dataSources.isAuth)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: 403, errors },
        });
      const post = await Post.findById(postId).populate("creator", "name");
      if (!post)
        throw new GraphQLError("Post not found", {
          extensions: { code: 404, errors },
        });
      console.log(post);
      return post;
    },

    fetchUserStatus: async (_, {}, { dataSources }) => {
      const errors = [];
      if (!dataSources.isAuth)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: 401, errors },
        });
      const user = await User.findById(dataSources.userId);
      if (!user)
        throw new GraphQLError("User not found", {
          extensions: { code: 422, errors },
        });
      return user.status;
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
      const imageUrl = postInput.imageUrl;
      const post = new Post({ title, content, imageUrl, creator: user._id });
      const createdPost = await post.save();
      createdPost.populate("creator", "name");
      user.posts.push(createdPost);
      await user.save();
      return { ...createdPost._doc, _id: createdPost._id.toString() };
    },

    editPost: async (
      _,
      { postId, postInput }: PostArguments,
      { dataSources }
    ) => {
      const errors = [];
      if (!dataSources.isAuth)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: 401, errors },
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
      if (errors.length > 0)
        throw new GraphQLError(errors[0].message, {
          extensions: { code: 422, errors },
        });
      const post = await Post.findById(postId);
      if (!post)
        throw new GraphQLError("Post not found", {
          extensions: { code: 422, errors },
        });
      if (post.creator._id.toString() !== dataSources.userId)
        throw new GraphQLError("Not authorized to edit this post", {
          extensions: { code: 403, errors },
        });
      post.title = postInput.title;
      post.content = postInput.content;
      const imageUrl = postInput.imageUrl ? postInput.imageUrl : null;
      if (imageUrl) {
        Utils.clearImage(post.imageUrl);
        post.imageUrl = imageUrl;
      }
      const editedPost = await post.save();
      console.log(editedPost);
      return { ...editedPost._doc, _id: editedPost._id.toString() };
    },

    deletePost: async (_, { postId }, { dataSources }) => {
      const errors = [];
      if (!dataSources.isAuth)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: 401, errors },
        });
      const post = await Post.findById(postId).populate("creator", "name");
      if (!post)
        throw new GraphQLError("Post not found", {
          extensions: { code: 404, errors },
        });
      if (post.creator._id.toString() !== dataSources.userId)
        throw new GraphQLError("Not authorized", {
          extensions: { code: 403, errors },
        });
      const user = await User.findById(dataSources.userId);
      user.posts.pull(postId);
      await user.save();
      const imageUrl = post.imageUrl;
      if (imageUrl) Utils.clearImage(imageUrl);
      await post.deleteOne();
      return postId;
    },

    editUserStatus: async (_, { newStatus }, { dataSources }) => {
      const errors = [];
      if (!dataSources.isAuth)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: 401, errors },
        });
      if (
        validator.isEmpty(newStatus) ||
        !validator.isLength(newStatus, { min: 5, max: 80 })
      )
        errors.push({ message: "The status is too short or too long (5-80)" });
      if (errors.length > 0)
        throw new GraphQLError(errors[0].message, {
          extensions: { code: 422, errors },
        });
      const user = await User.findById(dataSources.userId);
      if (!user)
        throw new GraphQLError("User not found", {
          extensions: { code: 422, errors },
        });
      user.status = newStatus;
      const updatedUser = await user.save();
      return updatedUser;
    },
  },
};

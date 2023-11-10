import { NextFunction } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { AuthController } from "../controllers/auth";
import mongoose, { ConnectOptions } from "mongoose";
import { UserController } from "../controllers/user";
import { FeedController } from "../controllers/feed";
import User from "../models/user";
import Post from "../models/post";
import { socketService } from "../socket";
import { Server } from "socket.io";

dotenv.config();

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("Feed Controller", () => {
  let connection: typeof mongoose;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  const user = new User();
  const unhashedPW = "TestP4s$word";

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    await User.deleteOne({ _id: "65427d3a657fd954fe1454e5" });
    await Post.deleteMany({});
    user._id = "65427d3a657fd954fe1454e5";
    user.email = "test2@test2.com";
    user.password = await bcrypt.hash(unhashedPW, 12);
    user.name = "Test Test Test";
    const foundUser = await User.findById("65427d3a657fd954fe1454e5");
    if (!foundUser) await user.save();
  });

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      //@ts-ignore
      json: jest.fn(function (data) {
        this.message = data.message;
        this.post = data.post;
        this.creator = data.creator;
      }),
      //@ts-ignore
      status: jest.fn(function (code) {
        this.statusCode = code;
        return this;
      }),
    };
  });

  afterAll(async () => {
    await User.deleteOne({ _id: "65427d3a657fd954fe1454e5" });
    await Post.deleteMany({});
    await connection.connection.close();
  });

  test("add a created post to the creator's posts", async () => {
    jest.spyOn(socketService, "getIO").mockImplementation(() => new Server());
    mockRequest = {
      body: {
        //@ts-ignore
        title: "Test Post Title",
        //@ts-ignore
        content: "Test Post Content",
      },
      file: {
        path: "img.jpeg",
      },
      userId: user._id,
    };

    await expect(
      Promise.resolve(
        FeedController.postPost(
          //@ts-ignore
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        )
      )
    ).resolves.toHaveProperty("post");
  });
});

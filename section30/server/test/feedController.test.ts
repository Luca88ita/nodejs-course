import { NextFunction } from "express";
import bcrypt from "bcrypt";
import { AuthController } from "../controllers/auth";
import mongoose, { ConnectOptions } from "mongoose";
import { UserController } from "../controllers/user";
import User from "../models/user";

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("Auth Controller - Login", () => {
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
    await User.deleteMany({});
    user._id = "654d23f602690f28ce0ddd73";
    user.email = "test3@test3.com";
    user.password = await bcrypt.hash(unhashedPW, 12);
    user.name = "Test Test Test";
    const foundUser = await User.findById("654d23f602690f28ce0ddd73");
    if (!foundUser) await user.save();
  });

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      //@ts-ignore
      json: jest.fn(function (data) {
        this.userStatus = data.status;
      }),
      //@ts-ignore
      status: jest.fn(function (code) {
        this.statusCode = code;
        return this;
      }),
    };
  });

  afterAll(async () => {
    await User.deleteMany({});
    await connection.connection.close();
  });

  test("throw 401 statusCode if db access fails", async () => {
    mockRequest = {
      body: {
        //@ts-ignore
        email: "fail@fail.co.uk",
        //@ts-ignore
        password: "failingPassw0rd!",
      },
    };

    await expect(
      Promise.resolve(
        AuthController.postLogin(
          //@ts-ignore
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        )
      )
    ).resolves.toHaveProperty("statusCode", 401);
  });

  test("return undefined if db access succeeds", async () => {
    mockRequest = {
      body: {
        //@ts-ignore
        email: user.email,
        //@ts-ignore
        password: unhashedPW,
      },
    };

    await expect(
      Promise.resolve(
        AuthController.postLogin(
          //@ts-ignore
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        )
      )
    ).resolves.toBeUndefined();
  });

  test("read statusCode 200 if user is present", async () => {
    const userId = user._id;
    mockRequest = {
      //@ts-ignore
      userId,
    };

    await expect(
      Promise.resolve(
        UserController.getStatus(
          //@ts-ignore
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        )
      )
    ).resolves.toHaveProperty("statusCode", 200);
  });
});

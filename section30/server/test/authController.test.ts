import { NextFunction } from "express";
import { AuthController } from "../controllers/auth";
import mongoose, { ConnectOptions } from "mongoose";
import { UserController } from "../controllers/user";

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("Auth Controller - Login", () => {
  let connection: typeof mongoose;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
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

  test("throw undefined if db access succeeds", async () => {
    mockRequest = {
      body: {
        //@ts-ignore
        email: "test3@test3.com",
        //@ts-ignore
        password: "TestP4s$word",
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
    const userId = "654cdfac29047952506bfa39";
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

import { NextFunction } from "express";
import { AuthController } from "../controllers/auth";
import User from "../models/user";
import mongoose, { ConnectOptions } from "mongoose";

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
    connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  });

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      //@ts-ignore
      status: jest.fn().mockReturnThis(),
    };
  });
  afterAll(async () => {
    await connection.connection.close();
  });

  test("throw an error if db access fails", async () => {
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

  test("throw 200 if db access succeeds", async () => {
    mockRequest = {
      body: {
        //@ts-ignore
        email: "test@test.com",
        //@ts-ignore
        password: "P4s$word",
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
});

import { isAuth } from "../middleware/is-auth";
import jwt from "jsonwebtoken";

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("isAuth middleware", () => {
  test("throw error if no auth header is present", () => {
    const req = {
      get: () => {
        return null;
      },
    };
    expect(isAuth.bind(this, req, {}, () => {})).toThrow();
  });

  test("throw error if auth header is only one string", () => {
    const req = {
      get: () => {
        return "test";
      },
    };
    expect(isAuth.bind(this, req, {}, () => {})).toThrow();
  });

  test("yelds a userId after decoding the token", () => {
    const req = {
      get: (headerName) => {
        return "Bearer test";
      },
    };

    jest.spyOn(jwt, "verify").mockImplementation(() => {
      return { userId: "test" };
    });

    //@ts-ignore
    isAuth(req, {}, () => {});
    expect(req).toHaveProperty("userId");
    expect(req).toHaveProperty("userId", "test");
    expect(jwt.verify).toHaveBeenCalled();
  });

  test("throw error if token cannot be verified", () => {
    const req = {
      get: (headerName) => {
        return "Bearer test";
      },
    };
    expect(isAuth.bind(this, req, {}, () => {})).toThrow();
  });
});

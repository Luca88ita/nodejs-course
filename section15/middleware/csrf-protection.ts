import { doubleCsrf } from "csrf-csrf";

const CSRF_SECRET = "@df$53D!weFSq4";

const CSRF_COOKIE_NAME = "csrfToken";

export const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: () => CSRF_SECRET,
    //@ts-ignore
    secret: CSRF_SECRET,
    cookieName: CSRF_COOKIE_NAME,
    cookieOptions: { sameSite: false, secure: false, signed: true }, // not ideal for production, development only
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  });

export const csrfErrorHandler = (error, req, res, next) => {
  if (error == invalidCsrfTokenError) {
    res.status(403).json({
      error: "csrf validation error",
    });
  } else {
    next();
  }
};

export interface ExtendedError extends Error {
  statusCode: number;
  data: any[];
}

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

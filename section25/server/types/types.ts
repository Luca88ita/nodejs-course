export interface ExtendedError extends Error {
  statusCode: number;
  data: any[];
}

export interface ExtendedRequest extends Request {
  userId?: string;
}

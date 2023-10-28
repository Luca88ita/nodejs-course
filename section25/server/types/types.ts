export interface ExtendedError extends Error {
  statusCode: number;
  data: any[];
}

export interface ExtendedRequest extends Request {
  //session: Session & Partial<SessionData>;
  userId?: string;
}

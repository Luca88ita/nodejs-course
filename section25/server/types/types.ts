export interface ExtendedError extends Error {
  statusCode: number;
  data: any[];
}

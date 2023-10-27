import { NextFunction } from "express";
import { ExtendedError } from "../types/types";

namespace Utils {
  export const errorHandler = (next: NextFunction, err: any) => {
    err.statusCode = !err.statusCode && 500;
    next(err);
  };

  export const throwNewError = (content?: string, statusCode?: number) => {
    const GENERIC_CONTENT = "An error occourred";
    const GENERIC_STATUSCODE = 500;
    const err = new Error(content ? content : GENERIC_CONTENT);
    const error: ExtendedError = {
      ...err,
      statusCode: statusCode ? statusCode : GENERIC_STATUSCODE,
    };
    throw error;
  };
}

export default Utils;

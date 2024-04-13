import { StatusCodes } from "http-status-codes";
import { BaseException } from "./exceptions/base.exception";
import { ErrorResponse } from "./models/error-response";

export const handleException = (err: any) => {
  if (err instanceof BaseException) {
    return new ErrorResponse(err.status, err.message);
  } else {
    return new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
};

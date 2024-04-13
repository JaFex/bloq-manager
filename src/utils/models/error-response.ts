import { StatusCodes } from "http-status-codes";
import { BaseResponse } from "./base-response.model";

export interface ResponseErrorBody {
  error: string;
}

export class ErrorResponse extends BaseResponse<ResponseErrorBody> {
  constructor(status: StatusCodes, error: string) {
    super(status, {
      error,
    });
  }
}

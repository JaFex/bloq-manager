import { StatusCodes } from "http-status-codes";
import { BaseException } from "./base.exception";

export class BadRequestError extends BaseException {
  constructor(error: string) {
    super(StatusCodes.BAD_REQUEST, error);
  }
}

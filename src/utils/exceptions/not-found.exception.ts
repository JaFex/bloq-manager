import { StatusCodes } from "http-status-codes";
import { BaseException } from "./base.exception";

export class NotFoundError extends BaseException {
  constructor(error: string) {
    super(StatusCodes.NOT_FOUND, error);
  }
}

import { StatusCodes } from "http-status-codes";

export class BaseException extends Error {
  public status: StatusCodes;
  constructor(status: StatusCodes, error: string) {
    super(error);
    this.status = status;
  }
}

import { StatusCodes } from "http-status-codes";

export class BaseResponse<T> {
  public status: StatusCodes;
  public data?: T;

  constructor(status: StatusCodes, data?: T) {
    this.status = status;
    this.data = data;
  }
}

import { BaseResponse } from "../../utils/models/base-response.model";
import { lockersRepository } from "./lockers.repository";
import { Locker, UpdateLocker } from "./lockers.model";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../../utils/models/error-response";
import { handleException } from "../../utils/handleException";

export const lockersService = {
  getAll: async (bloqId: string): Promise<BaseResponse<Locker[]>> => {
    const lockers = await lockersRepository.getAll(bloqId);
    return new BaseResponse(StatusCodes.OK, lockers);
  },
  getById: async (
    id: string
  ): Promise<BaseResponse<Locker> | ErrorResponse> => {
    try {
      const locker = await lockersRepository.getById(id);
      return new BaseResponse(StatusCodes.OK, locker);
    } catch (error) {
      return handleException(error);
    }
  },

  update: async (
    id: string,
    params: UpdateLocker
  ): Promise<BaseResponse<Locker> | ErrorResponse> => {
    try {
      const updatedLocker = await lockersRepository.update(id, params);
      return new BaseResponse(StatusCodes.OK, updatedLocker);
    } catch (error) {
      return handleException(error);
    }
  },
};

import { bloqsRepository } from "./bloqs.repository";
import { BaseResponse } from "../../utils/models/base-response.model";
import { Bloq, CreateBloqWithLockers, UpdateBloq } from "./bloqs.model";
import { StatusCodes } from "http-status-codes";
import { lockersRepository } from "../lockers/lockers.repository";
import { ErrorResponse } from "../../utils/models/error-response";
import { handleException } from "../../utils/handleException";

export const bloqsService = {
  getAll: async (): Promise<BaseResponse<Bloq[]>> => {
    const bloqs = await bloqsRepository.getAll();
    return new BaseResponse(StatusCodes.OK, bloqs);
  },

  getById: async (id: string): Promise<BaseResponse<Bloq> | ErrorResponse> => {
    try {
      const bloq = await bloqsRepository.getById(id);
      return new BaseResponse(StatusCodes.OK, bloq);
    } catch (error) {
      return handleException(error);
    }
  },

  create: async (
    params: CreateBloqWithLockers
  ): Promise<BaseResponse<Bloq>> => {
    const { numberOfLockers, ...data } = params;
    const bloq = await bloqsRepository.create(data);
    for (let i = 0; i < numberOfLockers; i++) {
      await lockersRepository.create({ bloqId: bloq.id });
    }
    return new BaseResponse(StatusCodes.CREATED, bloq);
  },

  update: async (
    id: string,
    params: UpdateBloq
  ): Promise<BaseResponse<Bloq> | ErrorResponse> => {
    try {
      const updatedBloq = await bloqsRepository.update(id, params);
      return new BaseResponse(StatusCodes.OK, updatedBloq);
    } catch (error) {
      return handleException(error);
    }
  },

  delete: async (id: string): Promise<BaseResponse<Bloq> | ErrorResponse> => {
    try {
      const deletedBloq = await bloqsRepository.delete(id);
      await lockersRepository.deleteByBloqId(id);
      return new BaseResponse(StatusCodes.OK, deletedBloq);
    } catch (error) {
      return handleException(error);
    }
  },
};

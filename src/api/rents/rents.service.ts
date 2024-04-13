import { BaseResponse } from "../../utils/models/base-response.model";
import { rentsRepository } from "./rents.repository";
import {
  Rent,
  RentStatus,
  UpdateRent,
  RentStatusSchema,
  CreateRent,
} from "./rents.model";
import { StatusCodes } from "http-status-codes";
import { lockersRepository } from "../lockers/lockers.repository";
import { handleException } from "../../utils/handleException";
import { ErrorResponse } from "../../utils/models/error-response";
import { BadRequestError } from "../../utils/exceptions/bad-request.exception";

const checkRentStatusUpdate = (
  actualRent: Rent,
  newStatus: RentStatus
): void => {
  if (actualRent.status === RentStatusSchema.enum.DELIVERED) {
    throw new BadRequestError(
      `Rent (${actualRent.id}) status cannot be updated to ${newStatus}.`
    );
  }

  if (actualRent.status === newStatus) {
    throw new BadRequestError(
      `Rent (${actualRent.id}) status is already ${newStatus}.`
    );
  }

  const actualStatusIndex = RentStatusSchema.options.indexOf(actualRent.status);
  const newStatusIndex = RentStatusSchema.options.indexOf(newStatus);
  if (newStatusIndex !== actualStatusIndex + 1) {
    throw new BadRequestError(
      `Rent (${actualRent.id}) status cannot be updated to ${newStatus}.`
    );
  }

  if (newStatus === RentStatusSchema.enum.DELIVERED) {
    lockersRepository.update(actualRent.lockerId, {
      isOccupied: false,
    });
  }

  if (newStatus === RentStatusSchema.enum.WAITING_DROPOFF) {
    lockersRepository.update(actualRent.lockerId, {
      isOccupied: true,
    });
  }
};

export const rentService = {
  getAll: async (lockerId: string): Promise<BaseResponse<Rent[]>> => {
    const res = await rentsRepository.getAll(lockerId);
    return new BaseResponse(StatusCodes.OK, res);
  },

  getById: async (id: string): Promise<BaseResponse<Rent> | ErrorResponse> => {
    try {
      const rent = await rentsRepository.getById(id);
      return new BaseResponse(StatusCodes.OK, rent);
    } catch (error) {
      return handleException(error);
    }
  },

  create: async (
    params: CreateRent
  ): Promise<BaseResponse<Rent> | ErrorResponse> => {
    try {
      const locker = await lockersRepository.getById(params.lockerId);
      if (locker.isOccupied)
        throw new BadRequestError(`Locker (${params.lockerId}) is occupied.`);
      const rent = await rentsRepository.create(params);
      return new BaseResponse(StatusCodes.CREATED, rent);
    } catch (error) {
      return handleException(error);
    }
  },

  update: async (
    id: string,
    params: UpdateRent
  ): Promise<BaseResponse<Rent> | ErrorResponse> => {
    try {
      const actualRent = await rentsRepository.getById(id);
      if (params.status) {
        checkRentStatusUpdate(actualRent, params.status);
      }
      if (
        (params.size || params.weight) &&
        actualRent.status !== RentStatusSchema.enum.CREATED
      ) {
        throw new BadRequestError(
          `Rent (${actualRent.id}) size and/or weight cannot be updated.`
        );
      }
      const updatedRent = await rentsRepository.update(id, params);
      return new BaseResponse(StatusCodes.OK, updatedRent);
    } catch (error) {
      return handleException(error);
    }
  },
};

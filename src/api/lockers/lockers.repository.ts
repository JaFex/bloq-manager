import { NotFoundError } from "../../utils/exceptions/not-found.exception";
import { lockers } from "./lockers.data";
import { CreateLocker, Locker, UpdateLocker } from "./lockers.model";
import { v4 as uuidv4 } from "uuid";

export const lockersRepository = {
  getAll: async (bloqId: string): Promise<Locker[]> => {
    return lockers.filter((locker) => locker.bloqId === bloqId);
  },
  getById: async (id: string): Promise<Locker> => {
    const locker = lockers.find((locker) => locker.id === id);
    if (!locker) throw new NotFoundError(`Locker (${id}) not found.`);
    return locker;
  },

  create: async (params: CreateLocker): Promise<Locker> => {
    const locker: Locker = {
      id: uuidv4(),
      ...params,
      isOccupied: false,
      status: "CLOSED",
    };
    lockers.push(locker);
    return locker;
  },

  update: async (id: string, params: UpdateLocker): Promise<Locker> => {
    const index = lockers.findIndex((locker) => locker.id === id);
    if (index === -1) throw new NotFoundError(`Locker (${id}) not found.`);
    lockers[index] = {
      ...lockers[index],
      ...params,
    };
    return lockers[index];
  },

  deleteByBloqId: async (bloqId: string): Promise<Locker[]> => {
    const deletedLockers = lockers.filter((locker) => locker.bloqId === bloqId);
    lockers.splice(
      lockers.findIndex((locker) => locker.bloqId === bloqId),
      deletedLockers.length
    );
    return deletedLockers;
  },
};

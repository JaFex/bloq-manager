import { NotFoundError } from "../../utils/exceptions/not-found.exception";
import { rents } from "./rents.data";
import { CreateRent, Rent, RentStatusSchema } from "./rents.model";
import { v4 as uuidv4 } from "uuid";

export const rentsRepository = {
  getAll: async (lockerId: string): Promise<Rent[]> => {
    return rents.filter((rent) => rent.lockerId === lockerId);
  },
  getById: async (id: string): Promise<Rent> => {
    const rent = rents.find((rent) => rent.id === id);
    if (!rent) throw new NotFoundError(`Rent (${id}) not found.`);
    return rent || null;
  },
  create: async (params: CreateRent): Promise<Rent> => {
    const rent = {
      id: uuidv4(),
      status: RentStatusSchema.enum.CREATED,
      ...params,
    };
    rents.push(rent);
    return rent;
  },

  update: async (id: string, params: Partial<Rent>): Promise<Rent> => {
    const index = rents.findIndex((rent) => rent.id === id);
    if (index === -1) throw new NotFoundError(`Rent (${id}) not found.`);
    rents[index] = {
      ...rents[index],
      ...params,
    };
    return rents[index];
  },
};

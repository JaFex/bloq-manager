import { NotFoundError } from "../../utils/exceptions/not-found.exception";
import { bloqs } from "./bloqs.data";
import { Bloq, CreateBloq, UpdateBloq } from "./bloqs.model";
import { v4 as uuidv4 } from "uuid";

export const bloqsRepository = {
  getAll: async (): Promise<Bloq[]> => bloqs,

  getById: async (id: string): Promise<Bloq> => {
    const bloq = bloqs.find((bloq) => bloq.id === id);
    if (!bloq) throw new NotFoundError(`Bloq (${id}) not found.`);
    return bloq;
  },

  create: async (params: CreateBloq): Promise<Bloq> => {
    const bloq: Bloq = {
      id: uuidv4(),
      ...params,
    };
    bloqs.push(bloq);
    return bloq;
  },

  update: async (id: string, params: UpdateBloq): Promise<Bloq> => {
    const index = bloqs.findIndex((locker) => locker.id === id);
    if (index === -1) throw new NotFoundError(`Bloq (${id}) not found.`);
    bloqs[index] = {
      ...bloqs[index],
      ...params,
    };
    return bloqs[index];
  },

  delete: async (id: string): Promise<Bloq> => {
    const index = bloqs.findIndex((bloq) => bloq.id === id);
    if (index === -1) throw new NotFoundError(`Bloq (${id}) not found.`);
    const deletedBloq = bloqs[index];
    bloqs.splice(index, 1);
    return deletedBloq;
  },
};

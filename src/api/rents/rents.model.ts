import { z } from "zod";

const RentSizeSchema = z.enum(["XS", "S", "M", "L", "XL"]);

export const RentStatusSchema = z.enum([
  "CREATED",
  "WAITING_DROPOFF",
  "WAITING_PICKUP",
  "DELIVERED",
]);

export const RentSchema = z.object({
  id: z.string().uuid(),
  lockerId: z.string().uuid(),
  weight: z.number(),
  size: RentSizeSchema,
  status: RentStatusSchema,
});

const CreateRentSchema = RentSchema.omit({ id: true, status: true });
const UpdateRentSchema = RentSchema.omit({
  id: true,
  lockerId: true,
}).partial();

export type RentSize = z.infer<typeof RentSizeSchema>;
export type RentStatus = z.infer<typeof RentStatusSchema>;
export type Rent = z.infer<typeof RentSchema>;
export type CreateRent = z.infer<typeof CreateRentSchema>;
export type UpdateRent = z.infer<typeof UpdateRentSchema>;

export const GetAllRentsSchema = z.object({
  query: z.object({
    lockerId: z.string().uuid(),
  }),
});

export const GetByIdRentsSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const PostRentSchema = z.object({
  body: CreateRentSchema,
});

export const PatchRentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: UpdateRentSchema,
});

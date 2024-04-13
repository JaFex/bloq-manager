import { z } from "zod";

const lockerStatusEnumSchema = z.enum(["OPEN", "CLOSED"]);

export const LockerSchema = z.object({
  id: z.string().uuid(),
  bloqId: z.string().uuid(),
  status: lockerStatusEnumSchema,
  isOccupied: z.boolean(),
});

const CreateLockerSchema = LockerSchema.omit({
  id: true,
  status: true,
  isOccupied: true,
});

const UpdateLockerSchema = LockerSchema.omit({
  id: true,
  bloqId: true,
}).partial();

export type LockerStatus = z.infer<typeof lockerStatusEnumSchema>;
export type Locker = z.infer<typeof LockerSchema>;
export type CreateLocker = z.infer<typeof CreateLockerSchema>;
export type UpdateLocker = z.infer<typeof UpdateLockerSchema>;

export const GetAllLockersSchema = z.object({
  query: z.object({
    bloqId: z.string().uuid(),
  }),
});
export type GetAllLockers = z.infer<typeof GetAllLockersSchema>;

export const GetByIdLockersSchema = z.object({
  params: z.object({
    bloqId: z.string().uuid(),
  }),
});

export const PostLockerSchema = z.object({
  body: CreateLockerSchema,
});

export const PatchLockerSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: LockerSchema.pick({ status: true }).optional(),
});

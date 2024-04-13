import { z } from "zod";

export const BloqSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  address: z.string(),
});

const CreateBloqSchema = BloqSchema.omit({ id: true });
const CreateBloqWIthLockersSchema = CreateBloqSchema.extend({
  numberOfLockers: z.number().gt(1),
});
const UpdateBloqSchema = CreateBloqSchema.partial();

export type Bloq = z.infer<typeof BloqSchema>;
export type CreateBloq = z.infer<typeof CreateBloqSchema>;
export type CreateBloqWithLockers = z.infer<typeof CreateBloqWIthLockersSchema>;
export type UpdateBloq = z.infer<typeof UpdateBloqSchema>;

export const GetUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const PostBloqSchema = z.object({
  body: CreateBloqWIthLockersSchema,
});

export const PatchBloqSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: UpdateBloqSchema,
});

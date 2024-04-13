import express from "express";
import { bloqsService } from "./bloqs.service";
import { validateRequest } from "../../utils/httpHandlers";
import { GetUserSchema, PatchBloqSchema, PostBloqSchema } from "./bloqs.model";

export const bloqsRouter = express.Router();

bloqsRouter.get("/", async (req, res) => {
  const response = await bloqsService.getAll();
  res.status(response.status).send(response.data);
});

bloqsRouter.post("/", validateRequest(PostBloqSchema), async (req, res) => {
  const response = await bloqsService.create(req.body);
  res.status(response.status).send(response.data);
});

bloqsRouter.get("/:id", validateRequest(GetUserSchema), async (req, res) => {
  const { id } = req.params;
  const response = await bloqsService.getById(id);
  res.status(response.status).send(response.data);
});

bloqsRouter.patch(
  "/:id",
  validateRequest(PatchBloqSchema),
  async (req, res) => {
    const { id } = req.params;
    const response = await bloqsService.update(id, req.body);
    res.status(response.status).send(response.data);
  }
);

bloqsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await bloqsService.delete(id);
  res.status(response.status).send(response.data);
});

import express from "express";
import { rentService } from "./rents.service";
import { validateRequest } from "../../utils/httpHandlers";
import {
  GetAllRentsSchema,
  GetByIdRentsSchema,
  PatchRentSchema,
  PostRentSchema,
} from "./rents.model";

export const rentsRouter = express.Router();

rentsRouter.get("/", validateRequest(GetAllRentsSchema), async (req, res) => {
  const { lockerId } = req.query;
  const response = await rentService.getAll(lockerId as string);
  res.status(response.status).send(response.data);
});

rentsRouter.post("/", validateRequest(PostRentSchema), async (req, res) => {
  const response = await rentService.create(req.body);
  res.status(response.status).send(response.data);
});

rentsRouter.get(
  "/:id",
  validateRequest(GetByIdRentsSchema),
  async (req, res) => {
    const { id } = req.params;
    const response = await rentService.getById(id);
    res.status(response.status).send(response.data);
  }
);

rentsRouter.patch(
  "/:id",
  validateRequest(PatchRentSchema),
  async (req, res) => {
    const { id } = req.params;
    const response = await rentService.update(id, req.body);
    res.status(response.status).send(response.data);
  }
);

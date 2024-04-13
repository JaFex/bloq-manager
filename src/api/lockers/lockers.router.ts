import express from "express";
import { lockersService } from "./lockers.service";
import { validateRequest } from "../../utils/httpHandlers";
import {
  GetAllLockersSchema,
  GetByIdLockersSchema,
  PatchLockerSchema,
  PostLockerSchema,
} from "./lockers.model";

export const lockersRouter = express.Router();

lockersRouter.get(
  "/",
  validateRequest(GetAllLockersSchema),
  async (req, res) => {
    const response = await lockersService.getAll(req?.query?.bloqId as string);
    res.status(response.status).send(response.data);
  }
);

lockersRouter.get(
  "/:id",
  validateRequest(GetByIdLockersSchema),
  async (req, res) => {
    const { id } = req.params;
    const response = await lockersService.getById(id);
    res.status(response.status).send(response.data);
  }
);

lockersRouter.patch(
  "/:id",
  validateRequest(PatchLockerSchema),
  async (req, res) => {
    const { id } = req.params;
    const response = await lockersService.update(id, req.body);
    res.status(response.status).send(response.data);
  }
);

import express from "express";

import { bloqsRouter } from "./bloqs/bloqs.router";
import { lockersRouter } from "./lockers/lockers.router";
import { rentsRouter } from "./rents/rents.router";

export const mainRouter = express.Router();

mainRouter.use("/bloqs", bloqsRouter);

mainRouter.use("/lockers", lockersRouter);

mainRouter.use("/rents", rentsRouter);

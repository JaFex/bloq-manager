import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./utils/envConfig";
import { mainRouter } from "./api/main.router";

const app = express();

app.use(express.json());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

app.use("/api", mainRouter);

export { app };

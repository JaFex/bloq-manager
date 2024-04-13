import { app } from "./server";
import { env } from "./utils/envConfig";

const server = app.listen(env.PORT, () => {
  console.info(
    `Server (${env.NODE_ENV}) running on port http://${env.HOST}:${env.PORT}`
  );
});

const onCloseSignal = () => {
  console.info("sigint received, shutting down");
  server.close(() => {
    console.info("server closed");
    process.exit();
  });
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);

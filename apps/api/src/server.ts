import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/healthRoutes.js";
import { attractionRouter } from "./routes/attractionRoutes.js";

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
  })
);
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    ok: true,
    message: "ITCamp Group 4 API is running",
  });
});

app.use("/api", healthRouter);
app.use("/api/attractions", attractionRouter);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});

import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/healthRoutes.js";
import { attractionRouter } from "./routes/attractionRoutes.js";
import { taxiRouter } from "./routes/taxiRoutes.js";
import mrtRoutes from "./routes/mrtRoutes.js";

// Creates server instance
const app = express();

// Allows cross-origin communication between the browser and server
app.use(
  cors({
    origin: env.clientOrigin,
  })
);

// Enables JSON parsing
app.use(express.json());

// Root routing
app.get("/", (_request, response) => {
  response.json({
    ok: true,
    message: "ITCamp Group 4 API is running",
  });
});

// Linking a router with a path
app.use("/api", healthRouter);
app.use("/api/attractions", attractionRouter);
app.use("/api/taxi", taxiRouter);
app.use("/api/mrt", mrtRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});

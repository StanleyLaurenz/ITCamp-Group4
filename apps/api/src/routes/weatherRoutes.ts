import { Router } from "express";
import { getWeather } from "../controllers/weatherController.js";

export const weatherRouter = Router();
weatherRouter.get("/", getWeather);

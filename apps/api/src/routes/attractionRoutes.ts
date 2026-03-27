import { Router } from "express";
import { getAttractions } from "../controllers/attractionController.js";

export const attractionRouter = Router();
attractionRouter.get("/", getAttractions);

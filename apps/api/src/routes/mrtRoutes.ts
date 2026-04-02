import { Router } from "express";
import { getMRTData } from "../controllers/mrtController.js";

export const mrtRouter = Router();
mrtRouter.get("/", getMRTData);
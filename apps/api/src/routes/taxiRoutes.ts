import { Router } from 'express';
import { getTaxis } from "../controllers/taxiController.js";

export const taxiRouter = Router();
taxiRouter.get("/", getTaxis);
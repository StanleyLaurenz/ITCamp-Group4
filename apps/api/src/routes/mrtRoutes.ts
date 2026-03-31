import { Router } from "express";
import { getMRTData } from "../controllers/mrtController.js";

const router = Router();
router.get("/", getMRTData);

export default router;

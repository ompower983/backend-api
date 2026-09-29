import { Router } from "express";
import { getDashboard } from "../../controllers";

const router = Router();

router.get("/", getDashboard);

export default router;
import { Router } from "express";
import { auth, user } from "./user";
import { dashboardRoutes } from "./dashboard";
import { mastersRoutes } from "./masters";

const router: Router = Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/dashboard', dashboardRoutes);
router.use('/masters', mastersRoutes);
export default router;
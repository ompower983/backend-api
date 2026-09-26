import { Router } from "express";
import { auth, user } from "./user";
import { dashboardRoutes } from "./dashboard";

const router: Router = Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/dashboard', dashboardRoutes);
export default router;
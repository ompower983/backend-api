import { Router } from "express";
import { auth, user } from "./user";

const router: Router = Router();

router.use('/auth', auth);
router.use('/users', user);

export default router;
import { Router } from "express";
import { loginSchema } from "../../validations";
import { authMiddleware } from "../../middlewares";
import { getUserProfile, loginUser } from "../../controllers/user";

const router: Router = Router();

// login user
router.post('/login', loginSchema, loginUser);

// get user profile
router.get('/profile', authMiddleware, getUserProfile);

export default router;
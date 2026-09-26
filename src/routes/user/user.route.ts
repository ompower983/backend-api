import { Router } from "express";


import {
    createUserSchema,
    getAllUserSchema,
    getUserSchema,
    updateUserSchema,
    deleteUserSchema,
} from "../../validations";

import {
    authMiddleware,
    isAdmin,
    isHR,
} from "../../middlewares";
import { createUser, deleteUser, getAllUser, getUser, updateUser } from "../../controllers/user";

const router: Router = Router();

router.post(
    "/create",
    authMiddleware,
    isAdmin,
    isHR,
    createUserSchema,
    createUser
);

router.get(
    "/all",
    authMiddleware,
    isAdmin,
    isHR,
    getAllUserSchema,
    getAllUser
);

router.get(
    "/:id",
    authMiddleware,
    isAdmin,
    isHR,
    getUserSchema,
    getUser
);

router.patch(
    "/:id",
    authMiddleware,
    isAdmin,
    isHR,
    updateUserSchema,
    updateUser
);

router.delete(
    "/:id",
    authMiddleware,
    isAdmin,
    isHR,
    deleteUserSchema,
    deleteUser
);

export default router;
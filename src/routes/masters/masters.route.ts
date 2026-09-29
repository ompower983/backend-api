import { Router } from "express";
import { getAllDepartments, getAllDesignations } from "../../controllers";

const router = Router();

router.get("/departments", getAllDepartments);

router.get("/designations", getAllDesignations);

export default router;
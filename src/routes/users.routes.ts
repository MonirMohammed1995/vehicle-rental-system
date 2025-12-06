import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { authorize } from "../middleware/role";
import { listUsers, getMe, updateUser, deleteUser } from "../controllers/users.controller";

const router = Router();
router.get("/", authMiddleware, authorize(["admin"]), listUsers);
router.get("/me", authMiddleware, getMe);
router.put("/:userId", authMiddleware, updateUser);
router.delete("/:userId", authMiddleware, authorize(["admin"]), deleteUser);

export default router;

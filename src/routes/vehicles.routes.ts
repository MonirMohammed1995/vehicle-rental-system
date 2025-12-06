import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { authorize } from "../middleware/role";
import { createVehicle, listVehicles, getVehicle, updateVehicle, deleteVehicle } from "../controllers/vehicles.controller";

const router = Router();
router.post("/", authMiddleware, authorize(["admin"]), createVehicle);
router.get("/", listVehicles);
router.get("/:vehicleId", getVehicle);
router.put("/:vehicleId", authMiddleware, authorize(["admin"]), updateVehicle);
router.delete("/:vehicleId", authMiddleware, authorize(["admin"]), deleteVehicle);

export default router;

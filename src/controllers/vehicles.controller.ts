import { Request, Response } from "express";
import { VehiclesService } from "../services/vehicles.service";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const v = await VehiclesService.create(req.body);
    return res.status(201).json({ success: true, message: "Vehicle created successfully", data: v });
  } catch (err: any) {
    if (err.code === "23505") return res.status(400).json({ success: false, message: "Registration number already exists" });
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const listVehicles = async (req: Request, res: Response) => {
  try {
    const rows = await VehiclesService.list();
    if (!rows.length) return res.status(200).json({ success: true, message: "No vehicles found", data: [] });
    return res.status(200).json({ success: true, message: "Vehicles retrieved successfully", data: rows });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const v = await VehiclesService.getById(Number(req.params.vehicleId));
    return res.status(200).json({ success: true, message: "Vehicle retrieved successfully", data: v });
  } catch (err: any) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const v = await VehiclesService.update(Number(req.params.vehicleId), req.body);
    return res.status(200).json({ success: true, message: "Vehicle updated successfully", data: v });
  } catch (err: any) {
    if (err.code === "23505") return res.status(400).json({ success: false, message: "Registration number already exists" });
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    const { rows } = await (await import("../config/db")).pool.query("SELECT id FROM bookings WHERE vehicle_id=$1 AND status='active' LIMIT 1", [vehicleId]);
    if (rows.length) return res.status(400).json({ success: false, message: "Vehicle has active bookings" });
    await VehiclesService.remove(vehicleId);
    return res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

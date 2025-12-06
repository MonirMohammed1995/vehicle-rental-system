import { Request, Response } from "express";
import { VehiclesService } from "../services/vehicles.service";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    if (!vehicle_name || !type || !registration_number || !daily_rent_price) return res.status(400).json({ message: "Missing fields" });
    const v = await VehiclesService.create({ vehicle_name, type, registration_number, daily_rent_price, availability_status });
    return res.status(201).json(v);
  } catch (err: any) {
    if (err.code === "23505") return res.status(400).json({ message: "Registration number already exists" });
    return res.status(500).json({ message: err.message });
  }
};

export const listVehicles = async (req: Request, res: Response) => {
  try {
    const rows = await VehiclesService.list();
    return res.status(200).json(rows);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const v = await VehiclesService.getById(Number(req.params.vehicleId));
    return res.status(200).json(v);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const v = await VehiclesService.update(Number(req.params.vehicleId), req.body);
    return res.status(200).json(v);
  } catch (err: any) {
    if (err.code === "23505") return res.status(400).json({ message: "Registration number already exists" });
    if (err.message === "No fields to update") return res.status(400).json({ message: err.message });
    return res.status(500).json({ message: err.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    // check active bookings
    const { rows } = await (await import("../config/db")).pool.query(`SELECT id FROM bookings WHERE vehicle_id=$1 AND status='active' LIMIT 1`, [vehicleId]);
    if (rows.length) return res.status(400).json({ message: "Vehicle has active bookings" });
    await VehiclesService.remove(vehicleId);
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
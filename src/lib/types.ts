export type Role = "manager" | "dispatcher" | "safety" | "finance";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
}

export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";
export interface Vehicle {
  id: string;
  registration: string;
  name: string;
  model: string;
  type: string;
  capacity: number; // kg
  odometer: number; // km
  cost: number;
  status: VehicleStatus;
  region?: string;
  documents?: { name: string; type: "Insurance" | "Registration" | "Permit"; uploadedAt: string }[];
}

export type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Suspended";
export interface Driver {
  id: string;
  name: string;
  license: string;
  licenseCategory: string;
  licenseExpiry: string; // ISO
  contact: string;
  safetyScore: number;
  status: DriverStatus;
}

export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled";
export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  plannedDistance: number;
  status: TripStatus;
  createdAt: string;
  revenue?: number;
}

export type MaintenanceStatus = "Active" | "Closed";
export interface Maintenance {
  id: string;
  vehicleId: string;
  serviceType: string;
  description: string;
  date: string;
  cost: number;
  status: MaintenanceStatus;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
  date: string;
}

export interface Expense {
  id: string;
  type: string;
  amount: number;
  date: string;
  note?: string;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  message: string;
  kind: "trip" | "maintenance" | "vehicle" | "driver" | "system";
}

export const VehicleStatus = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
} as const;

export type VehicleStatus = typeof VehicleStatus[keyof typeof VehicleStatus];

export interface Vehicle {
  id: number;
  reg_number: string;
  name: string;
  type: string;
  max_load_kg: number;
  odometer: number;
  acquisition_cost: number;
  status: VehicleStatus;
}

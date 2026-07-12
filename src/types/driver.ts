export const DriverStatus = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  OFF_DUTY: 'Off Duty',
  SUSPENDED: 'Suspended',
} as const;

export type DriverStatus = typeof DriverStatus[keyof typeof DriverStatus];

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  license_category: string;
  license_expiry_date: string; // ISO date string e.g. "2026-12-31"
  contact_number: string;
  safety_score: number;
  status: DriverStatus;
}

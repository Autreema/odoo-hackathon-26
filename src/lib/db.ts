import type {
  User, Vehicle, Driver, Trip, Maintenance, FuelLog, Expense, ActivityEntry,
} from "./types";

const KEY = "transitops.v1";

interface DB {
  users: User[];
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenance: Maintenance[];
  fuel: FuelLog[];
  expenses: Expense[];
  activity: ActivityEntry[];
  session: { userId: string | null };
}

const uid = () => Math.random().toString(36).slice(2, 10);

function seed(): DB {
  const users: User[] = [
    { id: uid(), email: "manager@transitops.com", password: "123456", name: "Priya Sharma", role: "manager" },
    { id: uid(), email: "dispatcher@transitops.com", password: "123456", name: "Rahul Verma", role: "dispatcher" },
    { id: uid(), email: "safety@transitops.com", password: "123456", name: "Anita Rao", role: "safety" },
    { id: uid(), email: "finance@transitops.com", password: "123456", name: "Vikram Iyer", role: "finance" },
  ];

  const vTypes = ["Mini Truck", "Truck", "Heavy Truck", "Container", "Van", "Trailer"];
  const regions = ["Chennai", "Bangalore", "Mumbai", "Delhi", "Hyderabad"];
  const models = ["Tata Ace Gold", "Ashok Leyland Dost", "Mahindra Bolero Pikup", "Eicher Pro 2049", "BharatBenz 1617", "Tata LPT 1613", "Volvo FM 420"];
  const statuses: Vehicle["status"][] = ["Available", "Available", "Available", "On Trip", "On Trip", "In Shop", "Retired"];

  const vehicles: Vehicle[] = Array.from({ length: 15 }, (_, i) => {
    const state = ["TN", "KA", "MH", "DL", "TS"][i % 5];
    const reg = `${state}${String((i % 9) + 1).padStart(2, "0")}AB${String(1000 + i * 137 % 9000).padStart(4, "0")}`;
    return {
      id: uid(),
      registration: reg,
      name: models[i % models.length],
      model: models[i % models.length],
      type: vTypes[i % vTypes.length],
      capacity: [1000, 1500, 3000, 5000, 8000, 12000, 20000][i % 7],
      odometer: 20000 + Math.floor(Math.random() * 180000),
      cost: 800000 + Math.floor(Math.random() * 4000000),
      status: statuses[i % statuses.length],
      region: regions[i % regions.length],
      documents: [],
    };
  });

  const firstNames = ["Alex", "Ravi", "Suresh", "Karthik", "Mohan", "Rajesh", "Deepak", "Vinod", "Arjun", "Sanjay", "Manoj", "Praveen", "Naveen", "Sathish", "Gopi"];
  const lastNames = ["Kumar", "Singh", "Reddy", "Patel", "Nair", "Sharma", "Gupta", "Menon", "Iyer", "Das", "Pillai", "Rao", "Shetty", "Bose", "Joshi"];
  const dStatuses: Driver["status"][] = ["Available", "Available", "Available", "On Trip", "Off Duty", "Suspended"];
  const drivers: Driver[] = Array.from({ length: 15 }, (_, i) => {
    const expiryOffset = i % 4 === 0 ? -10 + i : 60 + i * 30; // some expired-ish
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expiryOffset);
    return {
      id: uid(),
      name: `${firstNames[i]} ${lastNames[i]}`,
      license: `TN2025${String(100 + i).padStart(5, "0")}`,
      licenseCategory: ["LMV", "HMV", "HTV", "HGMV"][i % 4],
      licenseExpiry: expiry.toISOString().slice(0, 10),
      contact: `+91 9${String(100000000 + i * 12345678).slice(0, 9)}`,
      safetyScore: 60 + Math.floor(Math.random() * 40),
      status: dStatuses[i % dStatuses.length],
    };
  });

  const cities = ["Chennai", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Coimbatore", "Kochi"];
  const tStatuses: Trip["status"][] = ["Draft", "Dispatched", "Completed", "Completed", "Cancelled"];
  const trips: Trip[] = Array.from({ length: 15 }, (_, i) => {
    const created = new Date();
    created.setDate(created.getDate() - (i * 3));
    return {
      id: uid(),
      source: cities[i % cities.length],
      destination: cities[(i + 3) % cities.length],
      vehicleId: vehicles[i % vehicles.length].id,
      driverId: drivers[i % drivers.length].id,
      cargoWeight: 300 + Math.floor(Math.random() * 5000),
      plannedDistance: 100 + Math.floor(Math.random() * 1200),
      status: tStatuses[i % tStatuses.length],
      createdAt: created.toISOString(),
      revenue: 15000 + Math.floor(Math.random() * 60000),
    };
  });

  const serviceTypes = ["Oil Change", "Tire Rotation", "Brake Service", "Engine Overhaul", "AC Repair", "Battery Replacement"];
  const maintenance: Maintenance[] = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i * 5);
    return {
      id: uid(),
      vehicleId: vehicles[i % vehicles.length].id,
      serviceType: serviceTypes[i % serviceTypes.length],
      description: `${serviceTypes[i % serviceTypes.length]} — scheduled service`,
      date: d.toISOString().slice(0, 10),
      cost: 2000 + Math.floor(Math.random() * 25000),
      status: i < 3 ? "Active" : "Closed",
    };
  });

  const fuel: FuelLog[] = Array.from({ length: 20 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i * 2);
    const liters = 20 + Math.floor(Math.random() * 200);
    return {
      id: uid(),
      vehicleId: vehicles[i % vehicles.length].id,
      liters,
      cost: liters * (90 + Math.random() * 15),
      date: d.toISOString().slice(0, 10),
    };
  });

  const expTypes = ["Toll", "Parking", "Insurance", "Driver Allowance", "Permits", "Cleaning"];
  const expenses: Expense[] = Array.from({ length: 20 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    return {
      id: uid(),
      type: expTypes[i % expTypes.length],
      amount: 500 + Math.floor(Math.random() * 8000),
      date: d.toISOString().slice(0, 10),
    };
  });

  const activity: ActivityEntry[] = trips.slice(0, 6).map((t, i) => ({
    id: uid(),
    timestamp: new Date(Date.now() - i * 3600_000).toISOString(),
    message: `Trip ${t.source} → ${t.destination} ${t.status.toLowerCase()}`,
    kind: "trip",
  }));

  return { users, vehicles, drivers, trips, maintenance, fuel, expenses, activity, session: { userId: null } };
}

export function loadDB(): DB {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw);
  } catch {
    const s = seed();
    localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  }
}

export function saveDB(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
  window.dispatchEvent(new Event("transitops:update"));
}

export function resetDB() {
  const s = seed();
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("transitops:update"));
}

export function logActivity(kind: ActivityEntry["kind"], message: string) {
  const db = loadDB();
  db.activity.unshift({ id: uid(), timestamp: new Date().toISOString(), message, kind });
  db.activity = db.activity.slice(0, 50);
  saveDB(db);
}

export { uid };

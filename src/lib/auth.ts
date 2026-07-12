import { loadDB, saveDB } from "./db";
import type { User } from "./types";

export function currentUser(): User | null {
  const db = loadDB();
  if (!db.session.userId) return null;
  return db.users.find((u) => u.id === db.session.userId) ?? null;
}

export function login(email: string, password: string): User | null {
  const db = loadDB();
  const u = db.users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (!u) return null;
  db.session.userId = u.id;
  saveDB(db);
  return u;
}

export function logout() {
  const db = loadDB();
  db.session.userId = null;
  saveDB(db);
}

import { useSyncExternalStore } from "react";
import { loadDB } from "./db";

export function useDB() {
  const subscribe = (cb: () => void) => {
    const handler = () => cb();
    window.addEventListener("transitops:update", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("transitops:update", handler);
      window.removeEventListener("storage", handler);
    };
  };
  const snap = () => JSON.stringify(loadDB());
  const raw = useSyncExternalStore(subscribe, snap, snap);
  return JSON.parse(raw) as ReturnType<typeof loadDB>;
}

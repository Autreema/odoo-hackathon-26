import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    let loggedIn = false;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("transitops.v1");
        const db = raw ? JSON.parse(raw) : null;
        loggedIn = !!db?.session?.userId;
      } catch {}
    }
    throw redirect({ to: loggedIn ? "/dashboard" : "/login" });
  },
  component: () => null,
});

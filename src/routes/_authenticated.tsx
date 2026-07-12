import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("transitops.v1");
      const db = raw ? JSON.parse(raw) : null;
      if (!db?.session?.userId) throw redirect({ to: "/login" });
    } catch (e) {
      if ((e as any)?.isRedirect) throw e;
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

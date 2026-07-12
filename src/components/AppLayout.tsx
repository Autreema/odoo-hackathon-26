import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Truck, Users, Route as RouteIcon, Wrench, Fuel, Receipt,
  BarChart3, FileText, Settings, LogOut, Search, Bell, Sun, Moon, Menu, X, Bot, Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { currentUser, logout } from "@/lib/auth";
import { useDB } from "@/lib/useDB";
import { toast } from "sonner";
import { AssistantWidget } from "./AssistantWidget";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/vehicles", label: "Vehicles", icon: Truck },
  { to: "/drivers", label: "Drivers", icon: Users },
  { to: "/trips", label: "Trips", icon: RouteIcon },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/fuel", label: "Fuel", icon: Fuel },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nav_ = useNavigate();
  const db = useDB();
  const user = currentUser();
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("transitops.theme") ?? "dark";
    setDark(t === "dark");
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("transitops.theme", next ? "dark" : "light");
  };

  const alerts = useMemo(() => {
    const today = new Date();
    const in30 = new Date(); in30.setDate(today.getDate() + 30);
    const items: { id: string; title: string; body: string; kind: "warn" | "danger" | "info" }[] = [];
    db.drivers.forEach((d) => {
      const exp = new Date(d.licenseExpiry);
      if (exp < today) items.push({ id: `dl-${d.id}`, title: "Expired license", body: `${d.name} — ${d.licenseExpiry}`, kind: "danger" });
      else if (exp < in30) items.push({ id: `dl-${d.id}`, title: "License expiring soon", body: `${d.name} — ${d.licenseExpiry}`, kind: "warn" });
    });
    db.vehicles.forEach((v) => { if (v.odometer > 150000 && v.status !== "In Shop" && v.status !== "Retired") items.push({ id: `mv-${v.id}`, title: "Maintenance recommended", body: `${v.registration} — ${v.odometer.toLocaleString()} km`, kind: "warn" }); });
    // High fuel consumption
    const byV: Record<string, number> = {};
    db.fuel.forEach((f) => { byV[f.vehicleId] = (byV[f.vehicleId] || 0) + f.liters; });
    Object.entries(byV).forEach(([vid, liters]) => {
      if (liters > 400) { const v = db.vehicles.find(x => x.id === vid); if (v) items.push({ id: `fu-${vid}`, title: "High fuel consumption", body: `${v.registration} — ${Math.round(liters)} L`, kind: "info" }); }
    });
    return items.slice(0, 12);
  }, [db]);

  const doLogout = () => { logout(); toast.success("Signed out"); nav_({ to: "/login" }); };

  if (!user) {
    if (typeof window !== "undefined") nav_({ to: "/login" });
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground transform transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="gradient-primary w-9 h-9 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">TransitOps</span>
          </Link>
          <button className="md:hidden p-1" onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {nav.map((n) => {
            const active = pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${active ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"}`}>
                <Icon className={`w-4 h-4 ${active ? "text-primary" : ""}`} />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/40">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
              {user.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate capitalize">{roleLabel(user.role)}</div>
            </div>
            <button title="Sign out" className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive" onClick={doLogout}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 sticky top-0 z-30 glass-strong border-b border-border flex items-center gap-3 px-4">
          <button className="md:hidden p-2" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vehicles, drivers, trips…"
              className="w-full bg-background/60 border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-accent" title="Toggle theme">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="relative">
              <button onClick={() => setNotifOpen((v) => !v)} className="p-2 rounded-md hover:bg-accent relative">
                <Bell className="w-4 h-4" />
                {alerts.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-strong rounded-xl p-2 max-h-96 overflow-auto">
                  <div className="px-2 py-1 flex items-center justify-between">
                    <span className="text-sm font-semibold">Smart Alerts</span>
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  {alerts.length === 0 && <div className="p-4 text-sm text-muted-foreground">All clear.</div>}
                  {alerts.map((a) => (
                    <div key={a.id} className="p-2 rounded-lg hover:bg-accent/60 flex items-start gap-2">
                      <span className={`mt-1 w-2 h-2 rounded-full ${a.kind === "danger" ? "bg-destructive" : a.kind === "warn" ? "bg-warning" : "bg-info"}`} />
                      <div>
                        <div className="text-sm font-medium">{a.title}</div>
                        <div className="text-xs text-muted-foreground">{a.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {search ? <SearchResults q={search} onClose={() => setSearch("")} /> : children}
        </main>
      </div>

      <AssistantWidget />
    </div>
  );
}

function roleLabel(r: string) {
  return ({ manager: "Fleet Manager", dispatcher: "Dispatcher", safety: "Safety Officer", finance: "Financial Analyst" } as any)[r] || r;
}

function SearchResults({ q, onClose }: { q: string; onClose: () => void }) {
  const db = useDB();
  const s = q.toLowerCase();
  const vs = db.vehicles.filter(v => [v.registration, v.name, v.model, v.type].some(x => x.toLowerCase().includes(s)));
  const ds = db.drivers.filter(d => [d.name, d.license, d.contact].some(x => x.toLowerCase().includes(s)));
  const ts = db.trips.filter(t => [t.source, t.destination].some(x => x.toLowerCase().includes(s)));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Search results for "{q}"</h2>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Clear</button>
      </div>
      <ResultBlock title="Vehicles" empty={!vs.length}>{vs.map(v => <div key={v.id} className="glass rounded-lg p-3 text-sm"><b>{v.registration}</b> — {v.name} <span className="text-muted-foreground">({v.status})</span></div>)}</ResultBlock>
      <ResultBlock title="Drivers" empty={!ds.length}>{ds.map(d => <div key={d.id} className="glass rounded-lg p-3 text-sm"><b>{d.name}</b> — {d.license} <span className="text-muted-foreground">({d.status})</span></div>)}</ResultBlock>
      <ResultBlock title="Trips" empty={!ts.length}>{ts.map(t => <div key={t.id} className="glass rounded-lg p-3 text-sm"><b>{t.source} → {t.destination}</b> <span className="text-muted-foreground">({t.status})</span></div>)}</ResultBlock>
    </div>
  );
}

function ResultBlock({ title, empty, children }: { title: string; empty: boolean; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
      {empty ? <div className="text-sm text-muted-foreground">No matches.</div> : <div className="grid gap-2">{children}</div>}
    </div>
  );
}

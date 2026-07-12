import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Truck, CheckCircle2, Route as RouteIcon, Wrench, PlayCircle, Clock, Users, Gauge, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { useDB } from "@/lib/useDB";
import { PageHeader, GlassCard, Kpi, Select, currency } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Dashboard() {
  const db = useDB();
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [region, setRegion] = useState("all");

  const vehicles = db.vehicles.filter(v =>
    (type === "all" || v.type === type) &&
    (status === "all" || v.status === status) &&
    (region === "all" || v.region === region));

  const kpis = useMemo(() => {
    const total = vehicles.length;
    const avail = vehicles.filter(v => v.status === "Available").length;
    const onTrip = vehicles.filter(v => v.status === "On Trip").length;
    const inShop = vehicles.filter(v => v.status === "In Shop").length;
    const activeTrips = db.trips.filter(t => t.status === "Dispatched").length;
    const pendingTrips = db.trips.filter(t => t.status === "Draft").length;
    const onDuty = db.drivers.filter(d => d.status === "On Trip" || d.status === "Available").length;
    const util = total ? Math.round((onTrip / total) * 100) : 0;
    return { total, avail, onTrip, inShop, activeTrips, pendingTrips, onDuty, util };
  }, [vehicles, db]);

  const statusData = ["Available", "On Trip", "In Shop", "Retired"].map(s => ({ name: s, value: vehicles.filter(v => v.status === s).length }));

  const fuelMonthly = useMemo(() => {
    const map: Record<string, number> = {};
    db.fuel.forEach(f => { const m = f.date.slice(0, 7); map[m] = (map[m] || 0) + f.liters; });
    return Object.entries(map).sort().slice(-6).map(([m, v]) => ({ month: m, liters: Math.round(v) }));
  }, [db.fuel]);

  const maintMonthly = useMemo(() => {
    const map: Record<string, number> = {};
    db.maintenance.forEach(m => { const k = m.date.slice(0, 7); map[k] = (map[k] || 0) + m.cost; });
    return Object.entries(map).sort().slice(-6).map(([m, v]) => ({ month: m, cost: Math.round(v) }));
  }, [db.maintenance]);

  const tripPerf = useMemo(() => {
    const byMonth: Record<string, { completed: number; cancelled: number }> = {};
    db.trips.forEach(t => {
      const k = t.createdAt.slice(0, 7);
      byMonth[k] = byMonth[k] || { completed: 0, cancelled: 0 };
      if (t.status === "Completed") byMonth[k].completed++;
      if (t.status === "Cancelled") byMonth[k].cancelled++;
    });
    return Object.entries(byMonth).sort().slice(-6).map(([m, v]) => ({ month: m, ...v }));
  }, [db.trips]);

  const types = Array.from(new Set(db.vehicles.map(v => v.type)));
  const regions = Array.from(new Set(db.vehicles.map(v => v.region).filter(Boolean))) as string[];

  return (
    <div>
      <PageHeader
        title="Operations Dashboard"
        subtitle="Live fleet health, trips and cost visibility"
        right={
          <>
            <Select value={type} onChange={e => setType(e.target.value)}>
              <option value="all">All types</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {["Available", "On Trip", "In Shop", "Retired"].map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select value={region} onChange={e => setRegion(e.target.value)}>
              <option value="all">All regions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
          </>
        }
      />

      {/* Dashboard Overview (UI only) */}
      <div className="mt-2">
        <div className="glass-strong rounded-3xl p-5 sm:p-6 relative overflow-hidden" style={{ background: "color-mix(in oklab, var(--background) 55%, transparent)" }}>
          {/* dotted + glow background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(circle at 10% 20%, color-mix(in oklab,var(--primary)_35%,transparent), transparent 55%), radial-gradient(circle at 85% 80%, color-mix(in oklab,var(--chart-4)_25%,transparent), transparent 55%), linear-gradient(transparent,transparent)" ,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              opacity: 0.18,
            }}
          />

          <div className="relative z-10">
            <div className="flex items-end justify-between gap-3 mb-4">
              <div>
                <div className="inline-flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Connected signals across your operations.</p>
              </div>
            </div>

            {/* hero layout: left stack / hub / right stack */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              {/* Left cards */}
              <div className="flex flex-col gap-3">
                <div
                  className="glass rounded-[20px] border border-border p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-22px_rgba(0,240,255,0.25)] hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[18px] bg-[color-mix(in_oklab,var(--primary)_25%,transparent)] border border-[color-mix(in_oklab,var(--primary)_35%,transparent)] flex items-center justify-center">
                        <Truck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Fleet</div>
                        <div className="text-xs text-muted-foreground">Total: {kpis.total}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">View all →</div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground/80">Asset health and readiness at a glance.</div>
                </div>

                <div
                  className="glass rounded-[20px] border border-border p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-22px_rgba(0,240,255,0.25)] hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[18px] bg-[color-mix(in_oklab,var(--chart-4)_22%,transparent)] border border-[color-mix(in_oklab,var(--chart-4)_35%,transparent)] flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Drivers</div>
                        <div className="text-xs text-muted-foreground">On duty: {kpis.onDuty}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">View all →</div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground/80">Availability and scheduling insights.</div>
                </div>

                <div
                  className="glass rounded-[20px] border border-border p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-22px_rgba(0,240,255,0.25)] hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[18px] bg-[color-mix(in_oklab,var(--chart-1)_20%,transparent)] border border-[color-mix(in_oklab,var(--chart-1)_35%,transparent)] flex items-center justify-center">
                        <RouteIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Trips</div>
                        <div className="text-xs text-muted-foreground">Active: {kpis.activeTrips}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">View all →</div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground/80">Dispatch flow and operational progress.</div>
                </div>
              </div>

              {/* Center hub */}
              <div className="relative flex justify-center">
                {/* connectors */}
                <svg
                  viewBox="0 0 360 520"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="conn" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="rgb(114,75,255)" stopOpacity="0.7" />
                      <stop offset="1" stopColor="rgb(0,240,255)" stopOpacity="0.25" />
                    </linearGradient>
                  </defs>
                  {/* left connectors */}
                  <path d="M120 150 C170 150, 180 150, 200 150" stroke="url(#conn)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M120 260 C165 260, 180 260, 200 260" stroke="url(#conn)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M120 370 C165 370, 180 370, 200 370" stroke="url(#conn)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  {/* right connectors */}
                  <path d="M240 150 C205 150, 200 150, 160 150" stroke="url(#conn)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M240 260 C205 260, 200 260, 160 260" stroke="url(#conn)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M240 370 C205 370, 200 370, 160 370" stroke="url(#conn)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>

                <div className="relative w-[220px] h-[520px] max-w-[40vw]">
                  {/* double glowing rings */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full border border-primary/35 shadow-[0_0_80px_-20px_rgba(114,75,255,0.45)] bg-[radial-gradient(circle_at_center,rgba(114,75,255,0.25),rgba(0,240,255,0.08)_55%,transparent_70%)]" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border border-[rgba(0,240,255,0.35)] shadow-[0_0_60px_-25px_rgba(0,240,255,0.35)]" />

                  {/* truck icon */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[86px] h-[86px] rounded-[26px] glass border border-border flex items-center justify-center bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] shadow-[0_0_45px_-20px_rgba(0,240,255,0.30)]">
                    <Truck className="w-7 h-7 text-primary drop-shadow-[0_0_18px_rgba(0,240,255,0.35)]" />
                  </div>

                  {/* center text */}
                  <div className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(135deg,var(--primary),var(--chart-4))]">{kpis.util}%</div>
                    <div className="mt-1 text-xs text-muted-foreground">Utilization</div>
                  </div>
                </div>
              </div>

              {/* Right cards */}
              <div className="flex flex-col gap-3">
                <div
                  className="glass rounded-[20px] border border-border p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-22px_rgba(0,240,255,0.25)] hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[18px] bg-[color-mix(in_oklab,var(--chart-4)_22%,transparent)] border border-[color-mix(in_oklab,var(--chart-4)_35%,transparent)] flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Maintenance</div>
                        <div className="text-xs text-muted-foreground">In shop: {kpis.inShop}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">View all →</div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground/80">Maintenance schedule and cost visibility.</div>
                </div>

                <div
                  className="glass rounded-[20px] border border-border p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-22px_rgba(0,240,255,0.25)] hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[18px] bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] border border-[color-mix(in_oklab,var(--primary)_35%,transparent)] flex items-center justify-center">
                        <Gauge className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Fuel</div>
                        <div className="text-xs text-muted-foreground">Track consumption</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">View all →</div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground/80">Monthly fuel usage and efficiency signals.</div>
                </div>

                <div
                  className="glass rounded-[20px] border border-border p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_-22px_rgba(0,240,255,0.25)] hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[18px] bg-[color-mix(in_oklab,var(--chart-1)_20%,transparent)] border border-[color-mix(in_oklab,var(--chart-1)_35%,transparent)] flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Expenses</div>
                        <div className="text-xs text-muted-foreground">Costs overview</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">View all →</div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground/80">Budgeting signals and cost trends.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* KPIs */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">

        <Kpi label="Total Vehicles" value={kpis.total} icon={<Truck className="w-5 h-5" />} />
        <Kpi label="Available" value={kpis.avail} icon={<CheckCircle2 className="w-5 h-5" />} />
        <Kpi label="On Trip" value={kpis.onTrip} icon={<RouteIcon className="w-5 h-5" />} />
        <Kpi label="In Maintenance" value={kpis.inShop} icon={<Wrench className="w-5 h-5" />} />
        <Kpi label="Active Trips" value={kpis.activeTrips} icon={<PlayCircle className="w-5 h-5" />} />
        <Kpi label="Pending Trips" value={kpis.pendingTrips} icon={<Clock className="w-5 h-5" />} />
        <Kpi label="Drivers On Duty" value={kpis.onDuty} icon={<Users className="w-5 h-5" />} />
        <Kpi label="Fleet Utilization" value={`${kpis.util}%`} icon={<Gauge className="w-5 h-5" />} />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <GlassCard>
          <h3 className="font-semibold mb-3">Vehicle Status Distribution</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-3">Monthly Fuel Consumption (L)</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={fuelMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="liters" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-3">Maintenance Expenses</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={maintMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip formatter={(v: number) => currency(v)} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line dataKey="cost" stroke="var(--chart-3)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-3">Trip Performance</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={tripPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="completed" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="cancelled" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Activity Timeline</h3>
        </div>
        <div className="space-y-2 max-h-72 overflow-auto">
          {db.activity.length === 0 && <div className="text-sm text-muted-foreground">No activity yet.</div>}
          {db.activity.map(a => (
            <div key={a.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-primary" />
              <div className="flex-1">
                <div className="text-sm">{a.message}</div>
                <div className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

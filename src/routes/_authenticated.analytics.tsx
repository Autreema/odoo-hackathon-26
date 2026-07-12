import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Download, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useDB } from "@/lib/useDB";
import { PageHeader, GlassCard, Button, Kpi, currency, csvDownload } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const db = useDB();

  const perVehicle = useMemo(() => {
    return db.vehicles.map(v => {
      const km = db.trips.filter(t => t.vehicleId === v.id && t.status === "Completed").reduce((a, t) => a + t.plannedDistance, 0);
      const liters = db.fuel.filter(f => f.vehicleId === v.id).reduce((a, f) => a + f.liters, 0);
      const fuelCost = db.fuel.filter(f => f.vehicleId === v.id).reduce((a, f) => a + f.cost, 0);
      const maintCost = db.maintenance.filter(m => m.vehicleId === v.id).reduce((a, m) => a + m.cost, 0);
      const revenue = db.trips.filter(t => t.vehicleId === v.id && t.status === "Completed").reduce((a, t) => a + (t.revenue ?? 0), 0);
      const efficiency = liters > 0 ? km / liters : 0;
      const roi = v.cost > 0 ? ((revenue - fuelCost - maintCost) / v.cost) * 100 : 0;
      return { id: v.id, reg: v.registration, km, liters, fuelCost, maintCost, revenue, efficiency, roi };
    });
  }, [db]);

  const util = db.vehicles.length ? (db.vehicles.filter(v => v.status === "On Trip").length / db.vehicles.length) * 100 : 0;
  const avgEff = perVehicle.filter(p => p.efficiency > 0).reduce((a, p) => a + p.efficiency, 0) / (perVehicle.filter(p => p.efficiency > 0).length || 1);
  const totalRev = perVehicle.reduce((a, p) => a + p.revenue, 0);

  // exportCsv is defined later (kept single definition to avoid duplicate identifier)

  const computedTopEff = [...perVehicle]
    .filter((p) => p.efficiency > 0)
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 8);

  const demoEfficiency = [
    { reg: "Mini Truck", efficiency: 18.4 },
    { reg: "Truck A", efficiency: 16.8 },
    { reg: "Truck B", efficiency: 15.2 },
    { reg: "Van 1", efficiency: 19.1 },
    { reg: "Trailer", efficiency: 13.9 },
  ];

  const topEff = computedTopEff.length ? computedTopEff.map((p) => ({ reg: p.reg, efficiency: p.efficiency })) : demoEfficiency;

  const demoMonthlyFuel = [
    { month: "Jan", liters: 1200 },
    { month: "Feb", liters: 1050 },
    { month: "Mar", liters: 1320 },
    { month: "Apr", liters: 1180 },
    { month: "May", liters: 1400 },
    { month: "Jun", liters: 1260 },
  ];

  const demoFleetStatus = [
    { name: "Available", value: 45 },
    { name: "On Trip", value: 30 },
    { name: "Maintenance", value: 15 },
    { name: "Idle", value: 10 },
  ];

  const computedMonthlyFuel = useMemo(() => {
    const map: Record<string, number> = {};
    db.fuel.forEach((f: any) => {
      const d = String(f.date ?? "");
      const monthKey = d.length >= 7 ? d.slice(5, 7) : "";
      const year = d.length >= 4 ? d.slice(0, 4) : "";
      const key = monthKey && year ? `${year}-${monthKey}` : "";
      if (!key) return;
      map[key] = (map[key] || 0) + Number(f.liters || 0);
    });
    const entries = Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);

    const monthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = entries.map(([key, liters]) => {
      const mm = key.split("-")[1];
      const idx = mm ? Number(mm) - 1 : 0;
      return { month: monthNames[idx] ?? key, liters: Math.round(liters) };
    });

    return result;
  }, [db]);

  const monthlyFuel = computedMonthlyFuel.length ? computedMonthlyFuel : demoMonthlyFuel;

  const computedFleetStatus = useMemo(() => {
    const available = db.vehicles.filter((v: any) => v.status === "Available").length;
    const onTrip = db.vehicles.filter((v: any) => v.status === "On Trip").length;
    const maintenance = db.vehicles.filter((v: any) => v.status === "In Shop" || v.status === "Maintenance").length;
    const idle = db.vehicles.filter((v: any) => v.status === "Idle").length;
    const total = available + onTrip + maintenance + idle;
    if (!total) return [];
    return [
      { name: "Available", value: available },
      { name: "On Trip", value: onTrip },
      { name: "Maintenance", value: maintenance },
      { name: "Idle", value: idle },
    ];
  }, [db.vehicles]);

  const fleetStatus = computedFleetStatus.length ? computedFleetStatus : demoFleetStatus;

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["Registration", "Km", "Liters", "Efficiency (km/L)", "Fuel Cost", "Maintenance", "Revenue", "ROI %"],
      ...perVehicle.map((p) => [p.reg, p.km, p.liters.toFixed(1), p.efficiency.toFixed(2), p.fuelCost.toFixed(0), p.maintCost.toFixed(0), p.revenue.toFixed(0), p.roi.toFixed(1)]),
    ];
    csvDownload("transitops-analytics.csv", rows);
  };

  const statusColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-4)", "var(--chart-5)"];

  return (
    <div>
      <PageHeader
        title="Analytics & Reports"
        subtitle="Fleet performance, efficiency and ROI"
        right={
          <Button onClick={exportCsv}>
            <Download className="w-4 h-4" />Export CSV
          </Button>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Kpi label="Fleet Utilization" value={`${util.toFixed(1)}%`} icon={<TrendingUp className="w-5 h-5" />} />
        <Kpi label="Avg Fuel Efficiency" value={`${avgEff.toFixed(2)} km/L`} />
        <Kpi label="Total Revenue" value={currency(totalRev)} />
        <Kpi label="Vehicles Tracked" value={perVehicle.length} />
      </div>
      <GlassCard className="mb-4">
        <h3 className="font-semibold mb-3">Top Vehicles by Fuel Efficiency</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={topEff} isAnimationActive>
              <defs>
                <linearGradient id="barGradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="reg" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                label={{ value: "km/L", angle: -90, position: "insideLeft", offset: 8, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
                formatter={(value: any) => [`${Number(value).toFixed(2)} km/L`, "Fuel Efficiency"]}
              />
              <Bar dataKey="efficiency" fill="url(#barGradientBlue)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GlassCard className="!p-0 overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h3 className="font-semibold">Monthly Fuel Consumption (L)</h3>
            <p className="text-sm text-muted-foreground mt-1">Last 6 months</p>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyFuel} isAnimationActive>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  label={{ value: "Liters", angle: -90, position: "insideLeft", offset: 8, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
                  formatter={(value: any) => [`${Number(value).toFixed(0)}`, "Liters"]}
                />
                <Line type="monotone" dataKey="liters" stroke="var(--chart-2)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="!p-0 overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h3 className="font-semibold">Fleet Status Distribution</h3>
            <p className="text-sm text-muted-foreground mt-1">Current composition</p>
          </div>
          <div style={{ height: 300 }} className="flex items-center justify-center">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
                  formatter={(value: any, name: any) => [`${value}`, String(name)]}
                />
                <Pie
                  data={fleetStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                  isAnimationActive
                >
                  {fleetStatus.map((_: any, i: number) => (
                    <Cell key={i} fill={statusColors[i % statusColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="px-4 py-3">Vehicle</th><th className="px-4 py-3">Km</th><th className="px-4 py-3">Liters</th><th className="px-4 py-3">Efficiency</th><th className="px-4 py-3">Fuel Cost</th><th className="px-4 py-3">Maintenance</th><th className="px-4 py-3">Revenue</th><th className="px-4 py-3">ROI</th></tr>
            </thead>
            <tbody>
              {perVehicle.map(p => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono">{p.reg}</td>
                  <td className="px-4 py-3">{p.km.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.liters.toFixed(1)}</td>
                  <td className="px-4 py-3">{p.efficiency.toFixed(2)} km/L</td>
                  <td className="px-4 py-3">{currency(p.fuelCost)}</td>
                  <td className="px-4 py-3">{currency(p.maintCost)}</td>
                  <td className="px-4 py-3">{currency(p.revenue)}</td>
                  <td className={`px-4 py-3 font-medium ${p.roi >= 0 ? "text-[var(--success)]" : "text-destructive"}`}>{p.roi.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

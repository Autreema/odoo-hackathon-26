import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, PlayCircle, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDB } from "@/lib/useDB";
import { loadDB, saveDB, uid, logActivity } from "@/lib/db";
import type { Trip } from "@/lib/types";
import { PageHeader, GlassCard, Button, Input, Select, Field, Modal, StatusBadge } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/trips")({ component: TripsPage });

const empty: Trip = { id: "", source: "", destination: "", vehicleId: "", driverId: "", cargoWeight: 0, plannedDistance: 0, status: "Draft", createdAt: new Date().toISOString() };

function TripsPage() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [statusF, setStatusF] = useState("all");

  const vehicleOptions = useMemo(() =>
    db.vehicles.filter(v => v.status === "Available" || (editing && v.id === editing.vehicleId)),
    [db.vehicles, editing]);
  const driverOptions = useMemo(() => {
    const today = new Date();
    return db.drivers.filter(d => (d.status === "Available" || (editing && d.id === editing.driverId)) && new Date(d.licenseExpiry) >= today && d.status !== "Suspended");
  }, [db.drivers, editing]);

  const list = db.trips.filter(t => statusF === "all" || t.status === statusF);
  const vById = (id: string) => db.vehicles.find(v => v.id === id);
  const dById = (id: string) => db.drivers.find(d => d.id === id);

  const save = () => {
    if (!editing) return;
    if (!editing.source || !editing.destination || !editing.vehicleId || !editing.driverId) return toast.error("Fill required fields");
    const veh = vById(editing.vehicleId);
    if (veh && editing.cargoWeight > veh.capacity) return toast.error(`Cargo exceeds vehicle capacity (${veh.capacity} kg)`);
    const d = loadDB();
    if (editing.id) d.trips = d.trips.map(t => t.id === editing.id ? editing : t);
    else d.trips.push({ ...editing, id: uid() });
    saveDB(d); setOpen(false); setEditing(null); logActivity("trip", `Trip ${editing.source} → ${editing.destination} saved`); toast.success("Trip saved");
  };

  const dispatch = (t: Trip) => {
    const d = loadDB();
    d.vehicles = d.vehicles.map(v => v.id === t.vehicleId ? { ...v, status: "On Trip" } : v);
    d.drivers = d.drivers.map(x => x.id === t.driverId ? { ...x, status: "On Trip" } : x);
    d.trips = d.trips.map(x => x.id === t.id ? { ...x, status: "Dispatched" } : x);
    saveDB(d); logActivity("trip", `Trip ${t.source} → ${t.destination} dispatched`); toast.success("Trip dispatched");
  };
  const complete = (t: Trip) => {
    const d = loadDB();
    d.vehicles = d.vehicles.map(v => v.id === t.vehicleId ? { ...v, status: "Available" } : v);
    d.drivers = d.drivers.map(x => x.id === t.driverId ? { ...x, status: "Available" } : x);
    d.trips = d.trips.map(x => x.id === t.id ? { ...x, status: "Completed" } : x);
    saveDB(d); logActivity("trip", `Trip ${t.source} → ${t.destination} completed`); toast.success("Trip completed");
  };
  const cancel = (t: Trip) => {
    const d = loadDB();
    if (t.status === "Dispatched") {
      d.vehicles = d.vehicles.map(v => v.id === t.vehicleId ? { ...v, status: "Available" } : v);
      d.drivers = d.drivers.map(x => x.id === t.driverId ? { ...x, status: "Available" } : x);
    }
    d.trips = d.trips.map(x => x.id === t.id ? { ...x, status: "Cancelled" } : x);
    saveDB(d); logActivity("trip", `Trip cancelled`); toast.success("Trip cancelled");
  };
  const remove = (id: string) => { if (!confirm("Delete trip?")) return; const d = loadDB(); d.trips = d.trips.filter(t => t.id !== id); saveDB(d); toast.success("Deleted"); };

  return (
    <div>
      <PageHeader title="Trip Management"
        right={<><Select value={statusF} onChange={e => setStatusF(e.target.value)}><option value="all">All</option>{["Draft", "Dispatched", "Completed", "Cancelled"].map(s => <option key={s}>{s}</option>)}</Select><Button onClick={() => { setEditing({ ...empty }); setOpen(true); }}><Plus className="w-4 h-4" />New Trip</Button></>} />
      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="px-4 py-3">Route</th><th className="px-4 py-3">Vehicle</th><th className="px-4 py-3">Driver</th><th className="px-4 py-3">Cargo</th><th className="px-4 py-3">Distance</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {list.map(t => (
                <tr key={t.id} className="border-t border-border hover:bg-accent/30">
                  <td className="px-4 py-3 font-medium">{t.source} → {t.destination}</td>
                  <td className="px-4 py-3">{vById(t.vehicleId)?.registration ?? "—"}</td>
                  <td className="px-4 py-3">{dById(t.driverId)?.name ?? "—"}</td>
                  <td className="px-4 py-3">{t.cargoWeight} kg</td>
                  <td className="px-4 py-3">{t.plannedDistance} km</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {t.status === "Draft" && <button title="Dispatch" onClick={() => dispatch(t)} className="p-1.5 rounded hover:bg-accent text-[var(--info)]"><PlayCircle className="w-4 h-4" /></button>}
                      {t.status === "Dispatched" && <button title="Complete" onClick={() => complete(t)} className="p-1.5 rounded hover:bg-accent text-[var(--success)]"><CheckCircle2 className="w-4 h-4" /></button>}
                      {(t.status === "Draft" || t.status === "Dispatched") && <button title="Cancel" onClick={() => cancel(t)} className="p-1.5 rounded hover:bg-accent text-[var(--warning)]"><XCircle className="w-4 h-4" /></button>}
                      <button onClick={() => remove(t.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No trips.</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <Modal open={open} onClose={() => setOpen(false)} title="New Trip"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        {editing && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source *"><Input value={editing.source} onChange={e => setEditing({ ...editing, source: e.target.value })} /></Field>
            <Field label="Destination *"><Input value={editing.destination} onChange={e => setEditing({ ...editing, destination: e.target.value })} /></Field>
            <Field label="Vehicle *">
              <Select value={editing.vehicleId} onChange={e => setEditing({ ...editing, vehicleId: e.target.value })}>
                <option value="">Select…</option>
                {vehicleOptions.map(v => <option key={v.id} value={v.id}>{v.registration} — {v.name} ({v.capacity}kg)</option>)}
              </Select>
            </Field>
            <Field label="Driver *">
              <Select value={editing.driverId} onChange={e => setEditing({ ...editing, driverId: e.target.value })}>
                <option value="">Select…</option>
                {driverOptions.map(d => <option key={d.id} value={d.id}>{d.name} — {d.license}</option>)}
              </Select>
            </Field>
            <Field label="Cargo (kg)"><Input type="number" value={editing.cargoWeight} onChange={e => setEditing({ ...editing, cargoWeight: +e.target.value })} /></Field>
            <Field label="Planned Distance (km)"><Input type="number" value={editing.plannedDistance} onChange={e => setEditing({ ...editing, plannedDistance: +e.target.value })} /></Field>
          </div>
        )}
      </Modal>
    </div>
  );
}

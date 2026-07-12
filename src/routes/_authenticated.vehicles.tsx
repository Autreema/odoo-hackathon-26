import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { toast } from "sonner";
import { useDB } from "@/lib/useDB";
import { loadDB, saveDB, uid, logActivity } from "@/lib/db";
import type { Vehicle } from "@/lib/types";
import { PageHeader, GlassCard, Button, Input, Select, Field, Modal, StatusBadge, currency } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/vehicles")({ component: VehiclesPage });

const emptyV: Vehicle = { id: "", registration: "", name: "", model: "", type: "Mini Truck", capacity: 1000, odometer: 0, cost: 0, status: "Available", region: "Chennai", documents: [] };

function VehiclesPage() {
  const db = useDB();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [typeF, setTypeF] = useState("all");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [viewing, setViewing] = useState<Vehicle | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => db.vehicles.filter(v => {
    const s = search.toLowerCase();
    return (!s || [v.registration, v.name, v.model].some(x => x.toLowerCase().includes(s))) &&
      (statusF === "all" || v.status === statusF) &&
      (typeF === "all" || v.type === typeF);
  }), [db.vehicles, search, statusF, typeF]);

  const types = Array.from(new Set(db.vehicles.map(v => v.type)));

  const openNew = () => { setEditing({ ...emptyV }); setOpen(true); };
  const openEdit = (v: Vehicle) => { setEditing({ ...v }); setOpen(true); };
  const remove = (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    const d = loadDB();
    d.vehicles = d.vehicles.filter(v => v.id !== id);
    saveDB(d); logActivity("vehicle", "Vehicle deleted"); toast.success("Vehicle deleted");
  };

  const save = () => {
    if (!editing) return;
    if (!editing.registration.trim() || !editing.name.trim()) return toast.error("Fill required fields");
    const d = loadDB();
    const dup = d.vehicles.find(v => v.registration.toLowerCase() === editing.registration.toLowerCase() && v.id !== editing.id);
    if (dup) return toast.error("Registration number must be unique");
    if (editing.id) {
      d.vehicles = d.vehicles.map(v => v.id === editing.id ? editing : v);
      logActivity("vehicle", `Vehicle ${editing.registration} updated`);
    } else {
      d.vehicles.push({ ...editing, id: uid() });
      logActivity("vehicle", `Vehicle ${editing.registration} added`);
    }
    saveDB(d); setOpen(false); setEditing(null); toast.success("Saved");
  };

  return (
    <div>
      <PageHeader
        title="Vehicle Management"
        subtitle={`${db.vehicles.length} vehicles in fleet`}
        right={<Button onClick={openNew}><Plus className="w-4 h-4" />Add Vehicle</Button>}
      />

      <GlassCard className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search registration, model…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="all">All statuses</option>
            {["Available", "On Trip", "In Shop", "Retired"].map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={typeF} onChange={e => setTypeF(e.target.value)}>
            <option value="all">All types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
      </GlassCard>

      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Registration</th><th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Type</th><th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Odometer</th><th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-t border-border hover:bg-accent/30">
                  <td className="px-4 py-3 font-mono font-medium">{v.registration}</td>
                  <td className="px-4 py-3">{v.name}<div className="text-xs text-muted-foreground">{v.model}</div></td>
                  <td className="px-4 py-3">{v.type}</td>
                  <td className="px-4 py-3">{v.capacity.toLocaleString()} kg</td>
                  <td className="px-4 py-3">{v.odometer.toLocaleString()} km</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setViewing(v)} className="p-1.5 rounded hover:bg-accent"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(v)} className="p-1.5 rounded hover:bg-accent"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => remove(v.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No vehicles match.</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal open={open} onClose={() => setOpen(false)} title={editing?.id ? "Edit Vehicle" : "Add Vehicle"}
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        {editing && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Registration *"><Input value={editing.registration} onChange={e => setEditing({ ...editing, registration: e.target.value.toUpperCase() })} /></Field>
            <Field label="Vehicle Name *"><Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Model"><Input value={editing.model} onChange={e => setEditing({ ...editing, model: e.target.value })} /></Field>
            <Field label="Type">
              <Select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                {["Mini Truck", "Truck", "Heavy Truck", "Container", "Van", "Trailer"].map(t => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Max Load (kg)"><Input type="number" value={editing.capacity} onChange={e => setEditing({ ...editing, capacity: +e.target.value })} /></Field>
            <Field label="Odometer (km)"><Input type="number" value={editing.odometer} onChange={e => setEditing({ ...editing, odometer: +e.target.value })} /></Field>
            <Field label="Acquisition Cost (₹)"><Input type="number" value={editing.cost} onChange={e => setEditing({ ...editing, cost: +e.target.value })} /></Field>
            <Field label="Status">
              <Select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as Vehicle["status"] })}>
                {["Available", "On Trip", "In Shop", "Retired"].map(s => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Region">
              <Select value={editing.region} onChange={e => setEditing({ ...editing, region: e.target.value })}>
                {["Chennai", "Bangalore", "Mumbai", "Delhi", "Hyderabad"].map(r => <option key={r}>{r}</option>)}
              </Select>
            </Field>
          </div>
        )}
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Vehicle Details">
        {viewing && (
          <div className="space-y-2 text-sm">
            <Row k="Registration" v={viewing.registration} />
            <Row k="Name / Model" v={`${viewing.name} — ${viewing.model}`} />
            <Row k="Type" v={viewing.type} />
            <Row k="Capacity" v={`${viewing.capacity.toLocaleString()} kg`} />
            <Row k="Odometer" v={`${viewing.odometer.toLocaleString()} km`} />
            <Row k="Acquisition Cost" v={currency(viewing.cost)} />
            <Row k="Status" v={<StatusBadge status={viewing.status} />} />
            <Row k="Region" v={viewing.region ?? "—"} />
          </div>
        )}
      </Modal>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between border-b border-border py-2"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}

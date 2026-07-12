import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDB } from "@/lib/useDB";
import { loadDB, saveDB, uid, logActivity } from "@/lib/db";
import type { Maintenance } from "@/lib/types";
import { PageHeader, GlassCard, Button, Input, Select, Field, Modal, StatusBadge, currency } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/maintenance")({ component: MaintenancePage });

const empty: Maintenance = { id: "", vehicleId: "", serviceType: "Oil Change", description: "", date: new Date().toISOString().slice(0, 10), cost: 0, status: "Active" };

function MaintenancePage() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Maintenance | null>(null);

  const save = () => {
    if (!editing) return;
    if (!editing.vehicleId) return toast.error("Select a vehicle");
    const d = loadDB();
    if (editing.id) d.maintenance = d.maintenance.map(m => m.id === editing.id ? editing : m);
    else {
      d.maintenance.push({ ...editing, id: uid() });
      if (editing.status === "Active") d.vehicles = d.vehicles.map(v => v.id === editing.vehicleId ? { ...v, status: "In Shop" } : v);
    }
    saveDB(d); setOpen(false); logActivity("maintenance", "Maintenance record saved"); toast.success("Saved");
  };
  const close = (m: Maintenance) => {
    const d = loadDB();
    d.maintenance = d.maintenance.map(x => x.id === m.id ? { ...x, status: "Closed" } : x);
    d.vehicles = d.vehicles.map(v => v.id === m.vehicleId ? { ...v, status: "Available" } : v);
    saveDB(d); logActivity("maintenance", "Maintenance closed, vehicle available"); toast.success("Maintenance closed");
  };
  const remove = (id: string) => { if (!confirm("Delete?")) return; const d = loadDB(); d.maintenance = d.maintenance.filter(m => m.id !== id); saveDB(d); toast.success("Deleted"); };

  const vName = (id: string) => db.vehicles.find(v => v.id === id)?.registration ?? "—";

  return (
    <div>
      <PageHeader title="Maintenance Management" subtitle={`${db.maintenance.filter(m => m.status === "Active").length} active records`}
        right={<Button onClick={() => { setEditing({ ...empty }); setOpen(true); }}><Plus className="w-4 h-4" />Add Record</Button>} />
      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="px-4 py-3">Vehicle</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Cost</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {db.maintenance.map(m => (
                <tr key={m.id} className="border-t border-border hover:bg-accent/30">
                  <td className="px-4 py-3 font-mono">{vName(m.vehicleId)}</td>
                  <td className="px-4 py-3">{m.serviceType}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.description}</td>
                  <td className="px-4 py-3">{m.date}</td>
                  <td className="px-4 py-3">{currency(m.cost)}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {m.status === "Active" && <button title="Close" onClick={() => close(m)} className="p-1.5 rounded hover:bg-accent text-[var(--success)]"><CheckCircle2 className="w-4 h-4" /></button>}
                      <button onClick={() => remove(m.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {db.maintenance.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No records.</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <Modal open={open} onClose={() => setOpen(false)} title="Maintenance Record"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        {editing && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vehicle *">
              <Select value={editing.vehicleId} onChange={e => setEditing({ ...editing, vehicleId: e.target.value })}>
                <option value="">Select…</option>
                {db.vehicles.filter(v => v.status !== "Retired").map(v => <option key={v.id} value={v.id}>{v.registration}</option>)}
              </Select>
            </Field>
            <Field label="Service Type">
              <Select value={editing.serviceType} onChange={e => setEditing({ ...editing, serviceType: e.target.value })}>
                {["Oil Change", "Tire Rotation", "Brake Service", "Engine Overhaul", "AC Repair", "Battery Replacement", "General Service"].map(s => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Date"><Input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} /></Field>
            <Field label="Cost (₹)"><Input type="number" value={editing.cost} onChange={e => setEditing({ ...editing, cost: +e.target.value })} /></Field>
            <div className="col-span-2"><Field label="Description"><Input value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field></div>
            <Field label="Status">
              <Select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as Maintenance["status"] })}>
                {["Active", "Closed"].map(s => <option key={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
        )}
      </Modal>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useDB } from "@/lib/useDB";
import { loadDB, saveDB, uid, logActivity } from "@/lib/db";
import type { Driver } from "@/lib/types";
import { PageHeader, GlassCard, Button, Input, Select, Field, Modal, StatusBadge } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/drivers")({ component: DriversPage });

const empty: Driver = { id: "", name: "", license: "", licenseCategory: "LMV", licenseExpiry: new Date().toISOString().slice(0, 10), contact: "", safetyScore: 80, status: "Available" };

function DriversPage() {
  const db = useDB();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [editing, setEditing] = useState<Driver | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => db.drivers.filter(d => {
    const s = search.toLowerCase();
    return (!s || [d.name, d.license, d.contact].some(x => x.toLowerCase().includes(s))) &&
      (statusF === "all" || d.status === statusF);
  }), [db.drivers, search, statusF]);

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.license.trim()) return toast.error("Fill required fields");
    const d = loadDB();
    if (editing.id) {
      d.drivers = d.drivers.map(x => x.id === editing.id ? editing : x);
      logActivity("driver", `Driver ${editing.name} updated`);
    } else {
      d.drivers.push({ ...editing, id: uid() });
      logActivity("driver", `Driver ${editing.name} added`);
    }
    saveDB(d); setOpen(false); setEditing(null); toast.success("Saved");
  };
  const remove = (id: string) => {
    if (!confirm("Delete driver?")) return;
    const d = loadDB(); d.drivers = d.drivers.filter(x => x.id !== id); saveDB(d); toast.success("Deleted");
  };

  const today = new Date();
  return (
    <div>
      <PageHeader title="Driver Management" subtitle={`${db.drivers.length} drivers`}
        right={<Button onClick={() => { setEditing({ ...empty }); setOpen(true); }}><Plus className="w-4 h-4" />Add Driver</Button>} />
      <GlassCard className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search name, license…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="all">All statuses</option>
            {["Available", "On Trip", "Off Duty", "Suspended"].map(s => <option key={s}>{s}</option>)}
          </Select>
        </div>
      </GlassCard>
      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">License</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Expiry</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Safety</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const expired = new Date(d.licenseExpiry) < today;
                return (
                  <tr key={d.id} className="border-t border-border hover:bg-accent/30">
                    <td className="px-4 py-3 font-medium">{d.name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{d.license}</td>
                    <td className="px-4 py-3">{d.licenseCategory}</td>
                    <td className={`px-4 py-3 ${expired ? "text-destructive font-medium" : ""}`}>{d.licenseExpiry}{expired && " ⚠"}</td>
                    <td className="px-4 py-3">{d.contact}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${d.safetyScore}%` }} /></div>
                        <span className="text-xs">{d.safetyScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditing({ ...d }); setOpen(true); }} className="p-1.5 rounded hover:bg-accent"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(d.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No drivers.</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <Modal open={open} onClose={() => setOpen(false)} title={editing?.id ? "Edit Driver" : "Add Driver"}
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        {editing && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name *"><Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="License Number *"><Input value={editing.license} onChange={e => setEditing({ ...editing, license: e.target.value.toUpperCase() })} /></Field>
            <Field label="License Category">
              <Select value={editing.licenseCategory} onChange={e => setEditing({ ...editing, licenseCategory: e.target.value })}>
                {["LMV", "HMV", "HTV", "HGMV"].map(x => <option key={x}>{x}</option>)}
              </Select>
            </Field>
            <Field label="License Expiry"><Input type="date" value={editing.licenseExpiry} onChange={e => setEditing({ ...editing, licenseExpiry: e.target.value })} /></Field>
            <Field label="Contact"><Input value={editing.contact} onChange={e => setEditing({ ...editing, contact: e.target.value })} /></Field>
            <Field label="Safety Score"><Input type="number" min={0} max={100} value={editing.safetyScore} onChange={e => setEditing({ ...editing, safetyScore: +e.target.value })} /></Field>
            <Field label="Status">
              <Select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as Driver["status"] })}>
                {["Available", "On Trip", "Off Duty", "Suspended"].map(s => <option key={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
        )}
      </Modal>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Fuel } from "lucide-react";
import { toast } from "sonner";
import { useDB } from "@/lib/useDB";
import { loadDB, saveDB, uid } from "@/lib/db";
import { PageHeader, GlassCard, Button, Input, Select, Field, Modal, Kpi, currency } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/fuel")({ component: FuelPage });

function FuelPage() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ vehicleId: "", liters: 0, cost: 0, date: new Date().toISOString().slice(0, 10) });
  const total = useMemo(() => db.fuel.reduce((a, b) => a + b.cost, 0), [db.fuel]);
  const totalL = useMemo(() => db.fuel.reduce((a, b) => a + b.liters, 0), [db.fuel]);
  const avg = totalL ? total / totalL : 0;

  const save = () => {
    if (!form.vehicleId || form.liters <= 0) return toast.error("Fill required fields");
    const d = loadDB(); d.fuel.unshift({ id: uid(), ...form }); saveDB(d);
    setOpen(false); setForm({ vehicleId: "", liters: 0, cost: 0, date: new Date().toISOString().slice(0, 10) });
    toast.success("Fuel log added");
  };
  const remove = (id: string) => { const d = loadDB(); d.fuel = d.fuel.filter(f => f.id !== id); saveDB(d); };
  const vReg = (id: string) => db.vehicles.find(v => v.id === id)?.registration ?? "—";

  return (
    <div>
      <PageHeader title="Fuel Management" right={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" />Log Fuel</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Kpi label="Total Fuel Cost" value={currency(total)} icon={<Fuel className="w-5 h-5" />} />
        <Kpi label="Total Liters" value={`${Math.round(totalL).toLocaleString()} L`} />
        <Kpi label="Avg Price / L" value={`₹${avg.toFixed(2)}`} />
      </div>
      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Vehicle</th><th className="px-4 py-3">Liters</th><th className="px-4 py-3">Cost</th><th className="px-4 py-3">₹/L</th><th></th></tr>
            </thead>
            <tbody>
              {db.fuel.map(f => (
                <tr key={f.id} className="border-t border-border">
                  <td className="px-4 py-3">{f.date}</td>
                  <td className="px-4 py-3 font-mono">{vReg(f.vehicleId)}</td>
                  <td className="px-4 py-3">{f.liters.toFixed(1)} L</td>
                  <td className="px-4 py-3">{currency(f.cost)}</td>
                  <td className="px-4 py-3">₹{(f.cost / f.liters).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => remove(f.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <Modal open={open} onClose={() => setOpen(false)} title="Log Fuel"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vehicle *">
            <Select value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })}>
              <option value="">Select…</option>
              {db.vehicles.map(v => <option key={v.id} value={v.id}>{v.registration}</option>)}
            </Select>
          </Field>
          <Field label="Date"><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Liters"><Input type="number" value={form.liters} onChange={e => setForm({ ...form, liters: +e.target.value })} /></Field>
          <Field label="Cost (₹)"><Input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: +e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

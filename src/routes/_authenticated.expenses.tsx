import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { useDB } from "@/lib/useDB";
import { loadDB, saveDB, uid } from "@/lib/db";
import { PageHeader, GlassCard, Button, Input, Select, Field, Modal, Kpi, currency } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/expenses")({ component: ExpensesPage });

function ExpensesPage() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "Toll", amount: 0, date: new Date().toISOString().slice(0, 10), note: "" });

  const totals = useMemo(() => {
    const fuel = db.fuel.reduce((a, b) => a + b.cost, 0);
    const maint = db.maintenance.reduce((a, b) => a + b.cost, 0);
    const other = db.expenses.reduce((a, b) => a + b.amount, 0);
    return { fuel, maint, other, total: fuel + maint + other };
  }, [db]);

  const save = () => {
    if (!form.type || form.amount <= 0) return toast.error("Fill required fields");
    const d = loadDB(); d.expenses.unshift({ id: uid(), ...form }); saveDB(d);
    setOpen(false); setForm({ type: "Toll", amount: 0, date: new Date().toISOString().slice(0, 10), note: "" });
    toast.success("Expense added");
  };
  const remove = (id: string) => { const d = loadDB(); d.expenses = d.expenses.filter(e => e.id !== id); saveDB(d); };

  return (
    <div>
      <PageHeader title="Expense Management" right={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" />Add Expense</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Kpi label="Total Fuel" value={currency(totals.fuel)} icon={<Receipt className="w-5 h-5" />} />
        <Kpi label="Total Maintenance" value={currency(totals.maint)} />
        <Kpi label="Other Expenses" value={currency(totals.other)} />
        <Kpi label="Operational Cost" value={currency(totals.total)} />
      </div>
      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Note</th><th></th></tr>
            </thead>
            <tbody>
              {db.expenses.map(e => (
                <tr key={e.id} className="border-t border-border">
                  <td className="px-4 py-3">{e.date}</td>
                  <td className="px-4 py-3">{e.type}</td>
                  <td className="px-4 py-3">{currency(e.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.note ?? "—"}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => remove(e.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Expense"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type">
            <Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {["Toll", "Parking", "Insurance", "Driver Allowance", "Permits", "Cleaning", "Miscellaneous"].map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Amount (₹)"><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: +e.target.value })} /></Field>
          <Field label="Date"><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Note"><Input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

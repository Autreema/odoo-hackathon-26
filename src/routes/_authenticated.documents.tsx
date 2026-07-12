import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDB } from "@/lib/useDB";
import { loadDB, saveDB } from "@/lib/db";
import { PageHeader, GlassCard, Button, Select, Field, Modal, Input } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/documents")({ component: DocumentsPage });

function DocumentsPage() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ vehicleId: "", name: "", type: "Insurance" as "Insurance" | "Registration" | "Permit" });

  const save = () => {
    if (!form.vehicleId || !form.name) return toast.error("Fill required fields");
    const d = loadDB();
    d.vehicles = d.vehicles.map(v => v.id === form.vehicleId ? { ...v, documents: [...(v.documents ?? []), { name: form.name, type: form.type, uploadedAt: new Date().toISOString() }] } : v);
    saveDB(d); setOpen(false); setForm({ vehicleId: "", name: "", type: "Insurance" }); toast.success("Document added");
  };
  const removeDoc = (vid: string, idx: number) => {
    const d = loadDB();
    d.vehicles = d.vehicles.map(v => v.id === vid ? { ...v, documents: (v.documents ?? []).filter((_, i) => i !== idx) } : v);
    saveDB(d);
  };

  return (
    <div>
      <PageHeader title="Vehicle Documents" subtitle="Insurance, registration and permit records"
        right={<Button onClick={() => setOpen(true)}><Upload className="w-4 h-4" />Upload Document</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {db.vehicles.map(v => (
          <GlassCard key={v.id}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-mono font-semibold">{v.registration}</div>
                <div className="text-xs text-muted-foreground">{v.name}</div>
              </div>
              <FileText className="w-5 h-5 text-primary" />
            </div>
            {(v.documents ?? []).length === 0 && <div className="text-sm text-muted-foreground">No documents.</div>}
            <div className="space-y-1">
              {(v.documents ?? []).map((doc, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">{doc.type} · {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => removeDoc(v.id, i)} className="p-1 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Upload Document"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vehicle">
            <Select value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })}>
              <option value="">Select…</option>
              {db.vehicles.map(v => <option key={v.id} value={v.id}>{v.registration}</option>)}
            </Select>
          </Field>
          <Field label="Type">
            <Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}>
              {["Insurance", "Registration", "Permit"].map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <div className="col-span-2"><Field label="Document Name / Reference"><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Insurance Policy #123456" /></Field></div>
          <div className="col-span-2 text-xs text-muted-foreground">Note: Demo mode stores metadata only, not file bytes.</div>
        </div>
      </Modal>
    </div>
  );
}

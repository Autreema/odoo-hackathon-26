import { useMemo, useState } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { useDB } from "@/lib/useDB";

interface Msg { role: "user" | "bot"; text: string; }

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm TransitAI. Ask me about fuel efficiency, expiring licenses, operational cost, or fleet status." },
  ]);
  const [input, setInput] = useState("");
  const db = useDB();

  const answer = useMemo(() => (q: string): string => {
    const s = q.toLowerCase();
    if (s.includes("fuel") && (s.includes("efficien") || s.includes("best"))) {
      const km: Record<string, number> = {}, ltr: Record<string, number> = {};
      db.trips.filter(t => t.status === "Completed").forEach(t => { km[t.vehicleId] = (km[t.vehicleId] || 0) + t.plannedDistance; });
      db.fuel.forEach(f => { ltr[f.vehicleId] = (ltr[f.vehicleId] || 0) + f.liters; });
      const ranked = Object.keys(ltr).map(vid => ({ vid, eff: (km[vid] || 0) / ltr[vid] })).filter(r => r.eff > 0).sort((a, b) => b.eff - a.eff);
      if (!ranked.length) return "Not enough trip/fuel data yet.";
      const best = db.vehicles.find(v => v.id === ranked[0].vid);
      return `Best fuel efficiency: **${best?.registration}** (${best?.name}) at ${ranked[0].eff.toFixed(2)} km/L.`;
    }
    if (s.includes("license") || s.includes("expir")) {
      const today = new Date(), in30 = new Date(); in30.setDate(today.getDate() + 30);
      const soon = db.drivers.filter(d => new Date(d.licenseExpiry) < in30);
      if (!soon.length) return "No drivers with expiring or expired licenses.";
      return `${soon.length} driver(s) need attention:\n` + soon.map(d => `• ${d.name} — expires ${d.licenseExpiry}`).join("\n");
    }
    if (s.includes("operational") || s.includes("monthly") || s.includes("cost")) {
      const now = new Date(); const cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
      const fuelCost = db.fuel.filter(f => new Date(f.date) >= cutoff).reduce((a, b) => a + b.cost, 0);
      const maint = db.maintenance.filter(m => new Date(m.date) >= cutoff).reduce((a, b) => a + b.cost, 0);
      const exp = db.expenses.filter(e => new Date(e.date) >= cutoff).reduce((a, b) => a + b.amount, 0);
      const total = fuelCost + maint + exp;
      return `This month's operational cost: **₹${Math.round(total).toLocaleString()}**\n• Fuel: ₹${Math.round(fuelCost).toLocaleString()}\n• Maintenance: ₹${Math.round(maint).toLocaleString()}\n• Other expenses: ₹${Math.round(exp).toLocaleString()}`;
    }
    if (s.includes("fleet") || s.includes("utili")) {
      const total = db.vehicles.length;
      const onTrip = db.vehicles.filter(v => v.status === "On Trip").length;
      const pct = total ? Math.round((onTrip / total) * 100) : 0;
      return `Fleet utilization: **${pct}%** (${onTrip}/${total} on trip).`;
    }
    if (s.includes("vehicle") && s.includes("maint")) {
      const inShop = db.vehicles.filter(v => v.status === "In Shop");
      return inShop.length ? `${inShop.length} vehicle(s) in shop: ${inShop.map(v => v.registration).join(", ")}` : "No vehicles currently in maintenance.";
    }
    if (s.includes("driver") && s.includes("duty")) {
      const onDuty = db.drivers.filter(d => d.status !== "Off Duty" && d.status !== "Suspended").length;
      return `${onDuty} drivers on duty.`;
    }
    return "I can help with fuel efficiency, expiring licenses, monthly operational cost, fleet utilization, or vehicles in maintenance. Try one of those.";
  }, [db]);

  const send = () => {
    const q = input.trim(); if (!q) return;
    setMessages(m => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => setMessages(m => [...m, { role: "bot", text: answer(q) }]), 350);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 gradient-primary text-white rounded-full shadow-2xl p-4 hover:scale-105 transition">
        <Bot className="w-5 h-5" />
      </button>
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] max-w-sm h-[520px] glass-strong rounded-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="gradient-primary w-8 h-8 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
              <div>
                <div className="text-sm font-semibold">TransitAI</div>
                <div className="text-xs text-muted-foreground">Fleet intelligence assistant</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-accent"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-accent"}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask TransitAI…" className="flex-1 bg-background/60 border border-border rounded-lg px-3 py-2 text-sm outline-none" />
            <button onClick={send} className="gradient-primary text-white rounded-lg px-3"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </>
  );
}

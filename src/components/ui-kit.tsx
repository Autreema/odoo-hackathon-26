import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl p-5 ${className}`}>{children}</div>;
}

export function Kpi({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <GlassCard className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
          <div className="mt-2 text-2xl md:text-3xl font-bold">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
    </GlassCard>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let cls = "bg-muted text-muted-foreground";
  if (s.includes("available")) cls = "bg-[color-mix(in_oklab,var(--success)_25%,transparent)] text-[var(--success)]";
  else if (s.includes("on trip") || s.includes("dispatch")) cls = "bg-[color-mix(in_oklab,var(--info)_25%,transparent)] text-[var(--info)]";
  else if (s.includes("shop") || s.includes("maint") || s.includes("active")) cls = "bg-[color-mix(in_oklab,var(--warning)_25%,transparent)] text-[var(--warning)]";
  else if (s.includes("retired") || s.includes("suspend") || s.includes("cancel")) cls = "bg-[color-mix(in_oklab,var(--destructive)_20%,transparent)] text-[var(--destructive)]";
  else if (s.includes("complete") || s.includes("closed")) cls = "bg-[color-mix(in_oklab,var(--success)_20%,transparent)] text-[var(--success)]";
  else if (s.includes("draft") || s.includes("off")) cls = "bg-accent text-accent-foreground";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{status}</span>;
}

export function Button({ children, variant = "primary", className = "", ...rest }: any) {
  const v: Record<string, string> = {
    primary: "gradient-primary text-white hover:opacity-95",
    outline: "border border-border hover:bg-accent",
    ghost: "hover:bg-accent",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  };
  return (
    <button {...rest} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:opacity-50 ${v[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full bg-background/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${props.className ?? ""}`} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full bg-background/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${props.className ?? ""}`} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full bg-background/60 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${props.className ?? ""}`} />;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong w-full max-w-lg rounded-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-border flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function currency(n: number) { return `₹${Math.round(n).toLocaleString("en-IN")}`; }
export function csvDownload(name: string, rows: (string | number)[][]) {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}

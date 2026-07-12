import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Database, User } from "lucide-react";
import { toast } from "sonner";
import { currentUser } from "@/lib/auth";
import { resetDB } from "@/lib/db";
import { PageHeader, GlassCard, Button } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/settings")({ component: SettingsPage });

const roleLabel: Record<string, string> = { manager: "Fleet Manager", dispatcher: "Dispatcher", safety: "Safety Officer", finance: "Financial Analyst" };

function SettingsPage() {
  const u = currentUser();
  const reset = () => {
    if (!confirm("Reset all demo data? This clears your changes.")) return;
    resetDB(); toast.success("Demo data reset");
  };
  return (
    <div>
      <PageHeader title="Settings" subtitle="Preferences and account" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-3"><User className="w-4 h-4 text-primary" /><h3 className="font-semibold">Account</h3></div>
          <div className="text-sm space-y-2">
            <Row k="Name" v={u?.name ?? "—"} />
            <Row k="Email" v={u?.email ?? "—"} />
            <Row k="Role" v={roleLabel[u?.role ?? ""] ?? u?.role ?? "—"} />
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-3"><Database className="w-4 h-4 text-primary" /><h3 className="font-semibold">Demo Data</h3></div>
          <p className="text-sm text-muted-foreground">TransitOps uses browser storage for all records. Reset to restore realistic sample data.</p>
          <Button variant="outline" className="mt-3" onClick={reset}><RefreshCw className="w-4 h-4" />Reset demo data</Button>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-3">Roles & Access</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li><b className="text-foreground">Fleet Manager</b> — full access to fleet, drivers, trips and analytics.</li>
            <li><b className="text-foreground">Dispatcher</b> — trip creation, dispatch and driver assignment.</li>
            <li><b className="text-foreground">Safety Officer</b> — driver licensing and safety scoring.</li>
            <li><b className="text-foreground">Financial Analyst</b> — fuel, expenses and ROI reports.</li>
          </ul>
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-3">About</h3>
          <p className="text-sm text-muted-foreground">TransitOps is a demo enterprise SaaS for transport operations, showcasing fleet, driver, trip, maintenance, fuel, expense and analytics workflows with role-based access.</p>
        </GlassCard>
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between border-b border-border py-2"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}

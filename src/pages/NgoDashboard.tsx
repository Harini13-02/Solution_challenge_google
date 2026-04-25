// NgoDashboard.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../components/DashboardLayout";
import { reportsAPI } from "../services/api";
import { toast } from "sonner";

export function NgoDashboard() {
  const qc = useQueryClient();
  const { data: statsData } = useQuery({ queryKey: ["ngo-stats"], queryFn: () => reportsAPI.getStats() });
  const { data: reportsData } = useQuery({ queryKey: ["ngo-reports"], queryFn: () => reportsAPI.getAll({ status: "ai_verified" }) });

  const verify = useMutation({
    mutationFn: (id: string) => reportsAPI.updateStatus(id, { status: "ngo_verified" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ngo-reports"] }); toast.success("Report NGO-verified"); },
  });

  const start = useMutation({
    mutationFn: (id: string) => reportsAPI.updateStatus(id, { status: "in_progress" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ngo-reports"] }); toast.success("Marked as in progress"); },
  });

  const s = statsData?.data || {};
  const reports = reportsData?.data?.reports || [];

  const navItems = [
    { label: "Overview", href: "/ngo-dashboard", icon: "📊" },
    { label: "Pending Verification", href: "/ngo-dashboard", icon: "🔍" },
    { label: "Active Cases", href: "/ngo-dashboard", icon: "🔄" },
    { label: "Resolved", href: "/ngo-dashboard", icon: "✅" },
  ];

  return (
    <DashboardLayout title="NGO Dashboard" navItems={navItems} role="ngo">
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Reports", value: s.total ?? 0, icon: "📋" },
            { label: "Awaiting Verification", value: s.pending ?? 0, icon: "🔍" },
            { label: "In Progress", value: s.inProgress ?? 0, icon: "🔄" },
            { label: "Resolved", value: s.resolved ?? 0, icon: "✅" },
          ].map((st) => (
            <div key={st.label} className="bg-card border border-border rounded-xl p-4">
              <div className="text-xl mb-1">{st.icon}</div>
              <div className="text-2xl font-bold font-display">{st.value}</div>
              <div className="text-xs text-muted-foreground">{st.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold font-display">Reports Pending NGO Verification</h2>
          {reports.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl text-muted-foreground">No AI-verified reports pending review</div>
          ) : reports.map((r: any) => (
            <div key={r._id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
              <div className="flex flex-wrap items-start gap-4 justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">📍 {r.location?.city} · {new Date(r.createdAt).toLocaleDateString()} · {r.upvotes?.length ?? 0} upvotes · {r.volunteers?.length ?? 0} volunteers</p>
                  {r.aiAnalysis && (
                    <div className="mt-2 p-2 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                      <p className="text-xs text-blue-400">🤖 {r.aiAnalysis.summary}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => verify.mutate(r._id)} className="btn-secondary text-sm py-1.5 px-3">✅ Verify</button>
                  <button onClick={() => start.mutate(r._id)} className="btn-primary text-sm py-1.5 px-3">▶ Start</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NgoDashboard;
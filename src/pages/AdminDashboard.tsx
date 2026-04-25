import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../components/DashboardLayout";
import { reportsAPI } from "../services/api";
import { toast } from "sonner";
import { useState } from "react";

const STATUS_OPTIONS = ["pending","ai_verified","ngo_verified","in_progress","resolved","rejected"];

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("");
  const { data: statsData } = useQuery({ queryKey: ["admin-stats"], queryFn: () => reportsAPI.getStats() });
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["admin-reports", filter],
    queryFn: () => reportsAPI.getAll(filter ? { status: filter } : {}),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => reportsAPI.updateStatus(id, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-reports"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); toast.success("Status updated"); },
    onError: () => toast.error("Failed to update status"),
  });

  const s = statsData?.data || {};
  const reports = reportsData?.data?.reports || [];

  const navItems = [
    { label: "Overview", href: "/admin-dashboard", icon: "📊" },
    { label: "All Reports", href: "/admin-dashboard", icon: "📋" },
    { label: "Users", href: "/admin-dashboard", icon: "👥" },
    { label: "NGOs", href: "/admin-dashboard", icon: "🏢" },
    { label: "Settings", href: "/admin-dashboard", icon: "⚙️" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems} role="admin">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Reports", value: s.total ?? 0, icon: "📋", color: "border-primary/30" },
            { label: "Pending Review", value: s.pending ?? 0, icon: "⏳", color: "border-yellow-500/30" },
            { label: "In Progress", value: s.inProgress ?? 0, icon: "🔄", color: "border-orange-500/30" },
            { label: "Resolved", value: s.resolved ?? 0, icon: "✅", color: "border-green-500/30" },
            { label: "Critical", value: s.critical ?? 0, icon: "🚨", color: "border-red-500/30" },
          ].map((st) => (
            <div key={st.label} className={`bg-card border ${st.color} rounded-xl p-4`}>
              <div className="text-xl mb-1">{st.icon}</div>
              <div className="text-2xl font-bold font-display">{st.value}</div>
              <div className="text-xs text-muted-foreground">{st.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>All</button>
          {STATUS_OPTIONS.map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Reports table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border font-semibold">Reports Management</div>
          {isLoading ? (
            <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="divide-y divide-border">
              {reports.map((r: any) => (
                <div key={r._id} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex flex-wrap items-start gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{r.title}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {r.location?.city}, {r.location?.state} · by {r.reportedBy?.name} · {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize">{r.category}</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize">{r.urgency}</span>
                        {r.aiAnalysis && <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full">AI: {Math.round(r.aiAnalysis.confidence*100)}%</span>}
                      </div>
                    </div>
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus.mutate({ id: r._id, status: e.target.value })}
                      className="text-sm bg-muted border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary flex-shrink-0"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {reports.length === 0 && <div className="text-center py-12 text-muted-foreground">No reports found</div>}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
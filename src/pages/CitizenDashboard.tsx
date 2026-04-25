import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { reportsAPI } from "../services/api";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  ai_verified: "bg-blue-500/20 text-blue-400",
  ngo_verified: "bg-indigo-500/20 text-indigo-400",
  in_progress: "bg-orange-500/20 text-orange-400",
  resolved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

const URGENCY_STYLES: Record<string, string> = {
  low: "text-green-400", medium: "text-yellow-400", high: "text-orange-400", critical: "text-red-400",
};

export default function CitizenDashboard() {
  const { data: statsData } = useQuery({ queryKey: ["citizen-stats"], queryFn: () => reportsAPI.getStats() });
  const { data: reportsData, isLoading } = useQuery({ queryKey: ["citizen-reports"], queryFn: () => reportsAPI.getAll() });

  const stats = statsData?.data || {};
  const reports = reportsData?.data?.reports || [];

  const navItems = [
    { label: "My Reports", href: "/citizen-dashboard", icon: "📋" },
    { label: "New Report", href: "/reports/new", icon: "➕" },
    { label: "Community Feed", href: "/citizen-dashboard", icon: "🌍" },
  ];

  return (
    <DashboardLayout title="Citizen Dashboard" navItems={navItems} role="citizen">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Reports", value: stats.total ?? 0, icon: "📋", color: "border-primary/30" },
            { label: "Resolved", value: stats.resolved ?? 0, icon: "✅", color: "border-green-500/30" },
            { label: "In Progress", value: stats.inProgress ?? 0, icon: "🔄", color: "border-orange-500/30" },
            { label: "Pending", value: stats.pending ?? 0, icon: "⏳", color: "border-yellow-500/30" },
          ].map((s) => (
            <div key={s.label} className={`bg-card border ${s.color} rounded-xl p-5`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-3xl font-bold font-display">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reports list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">My Reports</h2>
            <Link to="/reports/new" className="btn-primary text-sm py-2 px-4">+ New Report</Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : reports.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-muted-foreground mb-4">You haven't filed any reports yet.</p>
              <Link to="/reports/new" className="btn-primary">File Your First Report</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r: any) => (
                <div key={r._id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
                  <div className="flex flex-wrap items-start gap-3 justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[r.status] || "bg-muted text-muted-foreground"}`}>
                          {r.status.replace("_", " ")}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs bg-muted text-muted-foreground capitalize">{r.category}</span>
                        <span className={`text-xs font-semibold ${URGENCY_STYLES[r.urgency]}`}>● {r.urgency}</span>
                      </div>
                      <h3 className="font-semibold text-foreground truncate">{r.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">📍 {r.location?.city}, {r.location?.state}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground flex-shrink-0">
                      <div>{new Date(r.createdAt).toLocaleDateString()}</div>
                      {r.upvotes?.length > 0 && <div className="mt-1">👍 {r.upvotes.length}</div>}
                    </div>
                  </div>
                  {r.aiAnalysis && (
                    <div className="mt-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                      <p className="text-xs text-blue-400 font-medium">🤖 AI Analysis · {Math.round(r.aiAnalysis.confidence * 100)}% confidence</p>
                      <p className="text-xs text-muted-foreground mt-1">{r.aiAnalysis.summary}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
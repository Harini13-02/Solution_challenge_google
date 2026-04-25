import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../components/DashboardLayout";
import { reportsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function VolunteerDashboard() {
  const qc = useQueryClient();

  const { data: statsData } = useQuery({ queryKey: ["vol-stats"], queryFn: () => reportsAPI.getStats() });
  const { data: availData } = useQuery({ 
    queryKey: ["vol-available"], 
    queryFn: () => reportsAPI.getAll() // Fetch all and filter client-side for better UX
  });

  const volunteer = useMutation({
    mutationFn: (id: string) => reportsAPI.volunteer(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["vol-available"] }); toast.success("You've joined this task!"); },
    onError: () => toast.error("Failed to join task"),
  });

  const { user } = useAuth();
  const s = statsData?.data || {};
  const allReports = availData?.data?.reports || [];
  
  // Available tasks: AI Verified or NGO Verified AND in the same city
  const available = allReports.filter((r: any) => {
    const userLoc = user?.location?.trim().toLowerCase();
    const reportLoc = r.location?.city?.trim().toLowerCase();
    
    const isNearby = userLoc && reportLoc && 
                    (userLoc.includes(reportLoc) || reportLoc.includes(userLoc));
                    
    const isJoinable = ["ai_verified", "ngo_verified", "in_progress"].includes(r.status) &&
                       !r.volunteers.includes(user?.id);
    return isNearby && isJoinable;
  });
  
  // My Tasks
  const myTasks = allReports.filter((r: any) => r.volunteers.includes(user?.id));

  const navItems = [
    { label: "Tasks Near You", href: "/volunteer-dashboard", icon: "📍" },
    { label: "My Tasks", href: "/volunteer-dashboard", icon: "📋" },
    { label: "Completed", href: "/volunteer-dashboard", icon: "🏆" },
    { label: "Leaderboard", href: "/volunteer-dashboard", icon: "⭐" },
  ];

  return (
    <DashboardLayout title="Volunteer Hub" navItems={navItems} role="volunteer">
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "My Active Tasks", value: s.myTasks ?? 0, icon: "🎯" },
            { label: "Completed", value: s.completed ?? 0, icon: "🏆" },
            { label: "Available", value: s.available ?? 0, icon: "🔓" },
          ].map((st) => (
            <div key={st.label} className="bg-card border border-border rounded-xl p-4">
              <div className="text-xl mb-1">{st.icon}</div>
              <div className="text-2xl font-bold font-display">{st.value}</div>
              <div className="text-xs text-muted-foreground">{st.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold font-display">Tasks Near You ({user?.location})</h2>
          {available.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl space-y-3">
              <div className="text-4xl">📍</div>
              <p className="text-muted-foreground">No active tasks found in <b>{user?.location}</b>.</p>
              <p className="text-xs text-muted-foreground px-10">We only show tasks in your registered city to ensure you can help on the ground.</p>
            </div>
          ) : available.map((r: any) => (
            <div key={r._id} className="bg-card border border-border rounded-xl p-5 hover:border-secondary/40 transition-colors">
              <div className="flex flex-wrap items-start gap-4 justify-between">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-muted text-muted-foreground capitalize">{r.category}</span>
                    <span className={`text-xs font-semibold ${r.urgency === "critical" ? "text-red-400" : r.urgency === "high" ? "text-orange-400" : "text-yellow-400"}`}>● {r.urgency}</span>
                  </div>
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-muted-foreground">📍 {r.location?.city}, {r.location?.state}</p>
                    {user?.location && r.location?.city && user.location.toLowerCase().includes(r.location.city.toLowerCase()) && (
                      <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">NEAR YOU</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">👥 {r.volunteers?.length ?? 0} volunteers joined</p>
                </div>
                <button onClick={() => volunteer.mutate(r._id)} className="btn-secondary text-sm py-2 px-4 flex-shrink-0">
                  🙋 Join Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
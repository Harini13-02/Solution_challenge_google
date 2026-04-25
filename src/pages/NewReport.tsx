import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { reportsAPI } from "../services/api";
import { useAuth, ROLE_HOME } from "../context/AuthContext";
import { toast } from "sonner";

const CATEGORIES = ["infrastructure","environment","health","education","safety","hunger","other"];
const URGENCY = [
  { value: "low", label: "Low", color: "border-green-500/50 text-green-400" },
  { value: "medium", label: "Medium", color: "border-yellow-500/50 text-yellow-400" },
  { value: "high", label: "High", color: "border-orange-500/50 text-orange-400" },
  { value: "critical", label: "Critical 🚨", color: "border-red-500/50 text-red-400" },
];

export default function NewReport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "infrastructure", urgency: "medium",
    location: { address: "", city: "", state: "" },
    fundingGoal: "",
  });

  const set = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setLoc = (k: string) => (e: any) => setForm((f) => ({ ...f, location: { ...f.location, [k]: e.target.value } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await reportsAPI.create({ ...form, fundingGoal: form.fundingGoal ? Number(form.fundingGoal) : undefined });
      toast.success("Report submitted! AI analysis running…");
      navigate(ROLE_HOME[user!.role]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6">
        <Link to={user ? ROLE_HOME[user.role] : "/"} className="text-muted-foreground hover:text-foreground text-sm">← Back to Dashboard</Link>
        <span className="text-xl font-bold font-display text-gradient">CommUnity AI</span>
        <div />
      </header>

      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display">File a Community Report</h1>
          <p className="text-muted-foreground mt-2">Your report will be AI-analyzed and routed to the right NGO for action.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold font-display text-lg">Report Details</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title <span className="text-destructive">*</span></label>
              <input value={form.title} onChange={set("title")} required maxLength={200}
                placeholder="Brief description of the issue (e.g., Large pothole on Main Street)" className="input-field" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Detailed Description <span className="text-destructive">*</span></label>
              <textarea value={form.description} onChange={set("description")} required rows={4} maxLength={2000}
                placeholder="Describe the problem in detail — what, where, when, how severe..." className="input-field resize-none" />
              <p className="text-xs text-muted-foreground">{form.description.length}/2000 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category <span className="text-destructive">*</span></label>
                <select value={form.category} onChange={set("category")} className="input-field">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Urgency Level <span className="text-destructive">*</span></label>
                <div className="grid grid-cols-2 gap-1.5">
                  {URGENCY.map((u) => (
                    <button key={u.value} type="button" onClick={() => setForm((f) => ({ ...f, urgency: u.value }))}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all ${form.urgency === u.value ? u.color + " bg-current/10" : "border-border text-muted-foreground hover:border-muted-foreground"}`}>
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold font-display text-lg">Location</h2>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Address <span className="text-destructive">*</span></label>
              <input value={form.location.address} onChange={setLoc("address")} required placeholder="Street address, landmark" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">City <span className="text-destructive">*</span></label>
                <input value={form.location.city} onChange={setLoc("city")} required placeholder="City" className="input-field" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">State <span className="text-destructive">*</span></label>
                <input value={form.location.state} onChange={setLoc("state")} required placeholder="State" className="input-field" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <h2 className="font-semibold font-display text-lg">Funding Goal <span className="text-muted-foreground font-normal text-sm">(optional)</span></h2>
            <p className="text-sm text-muted-foreground">Set a funding goal if this issue needs financial support for resolution.</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <input type="number" value={form.fundingGoal} onChange={set("fundingGoal")} min="0" placeholder="0" className="input-field pl-7" />
            </div>
          </div>

          <div className="flex gap-4">
            <Link to={user ? ROLE_HOME[user.role] : "/"} className="btn-secondary flex-1 text-center py-3">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? "Submitting…" : "Submit Report →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
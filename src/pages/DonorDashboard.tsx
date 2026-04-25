import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../components/DashboardLayout";
import { reportsAPI, donationsAPI } from "../services/api";
import { toast } from "sonner";

export default function DonorDashboard() {
  const qc = useQueryClient();
  const [donating, setDonating] = useState<{ id: string; title: string } | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [tip, setTip] = useState(0);

  const { data: statsData } = useQuery({ queryKey: ["donor-stats"], queryFn: () => donationsAPI.getStats() });
  const { data: reportsData } = useQuery({ queryKey: ["donor-reports"], queryFn: () => reportsAPI.getAll({ status: "ngo_verified" }) });
  const { data: donationsData } = useQuery({ queryKey: ["my-donations"], queryFn: () => donationsAPI.getMy() });

  const donate = useMutation({
    mutationFn: (data: any) => donationsAPI.donate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-donations"] });
      qc.invalidateQueries({ queryKey: ["donor-stats"] });
      toast.success("Donation successful! Thank you 💖");
      setDonating(null); setAmount(""); setMessage(""); setTip(0);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Donation failed"),
  });

  const s = statsData?.data || {};
  const reports = reportsData?.data?.reports?.filter((r: any) => r.fundingGoal) || [];
  const myDonations = donationsData?.data?.donations || [];

  const navItems = [
    { label: "Fund Projects", href: "/donor-dashboard", icon: "💰" },
    { label: "My Donations", href: "/donor-dashboard", icon: "📋" },
    { label: "Impact Report", href: "/donor-dashboard", icon: "📊" },
  ];

  const totalAmount = Number(amount) + tip;

  return (
    <DashboardLayout title="Donor Dashboard" navItems={navItems} role="donor">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Donated", value: `₹${(s.totalDonated ?? 0).toLocaleString()}`, icon: "💰" },
            { label: "Total Donations", value: s.totalDonations ?? 0, icon: "🎁" },
            { label: "Reports Funded", value: s.reportsSupported ?? 0, icon: "🏘️" },
          ].map((st) => (
            <div key={st.label} className="bg-card border border-border rounded-xl p-4">
              <div className="text-xl mb-1">{st.icon}</div>
              <div className="text-2xl font-bold font-display">{st.value}</div>
              <div className="text-xs text-muted-foreground">{st.label}</div>
            </div>
          ))}
        </div>

        {/* Donation modal */}
        {donating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
              <div>
                <h3 className="text-lg font-bold font-display">Donate to Project</h3>
                <p className="text-xs text-muted-foreground truncate">{donating.title}</p>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 5000].map((a) => (
                    <button key={a} onClick={() => setAmount(String(a))} className={`py-2 rounded-lg text-sm font-semibold transition-colors ${amount === String(a) ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted hover:bg-muted/80"}`}>₹{a}</button>
                  ))}
                </div>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Custom amount (₹)" className="input-field" min="1" />
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                <p className="text-xs font-bold text-primary flex items-center gap-2">✨ Support CommUnity AI platform</p>
                <div className="flex gap-2">
                  {[0, 10, 20, 50].map((pct) => (
                    <button key={pct} onClick={() => setTip(Math.round(Number(amount) * (pct / 100)))}
                      className={`flex-1 py-1.5 rounded-md text-[10px] font-bold border transition-all ${tip === Math.round(Number(amount) * (pct / 100)) && pct !== 0 ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                      {pct === 0 ? "None" : `${pct}%`}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">App Tip:</span>
                  <span className="text-foreground">₹{tip}</span>
                </div>
              </div>

              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Leave a message (optional)" rows={2} className="input-field resize-none" />
              
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setDonating(null); setTip(0); }} className="btn-secondary flex-1">Cancel</button>
                <button
                  onClick={() => donate.mutate({ reportId: donating.id, amount: Number(amount), platformTip: tip, message })}
                  disabled={!amount || Number(amount) <= 0 || donate.isPending}
                  className="btn-primary flex-1 shadow-lg shadow-primary/20"
                >{donate.isPending ? "Processing…" : `Pay ₹${totalAmount}`}</button>
              </div>
            </div>
          </div>
        )}

        {/* Fund projects */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold font-display">Active Fundraising Projects</h2>
          {reports.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl text-muted-foreground">No active fundraising projects right now</div>
          ) : reports.map((r: any) => {
            const pct = r.fundingGoal ? Math.min(100, Math.round((r.fundingRaised / r.fundingGoal) * 100)) : 0;
            return (
              <div key={r._id} className="bg-card border border-border rounded-xl p-5 hover:border-purple-500/40 transition-colors">
                <div className="flex flex-wrap items-start gap-4 justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₹{r.fundingRaised?.toLocaleString()} raised</span>
                        <span>{pct}% · Goal: ₹{r.fundingGoal?.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setDonating({ id: r._id, title: r.title })} className="btn-primary text-sm py-2 px-4 flex-shrink-0">💰 Donate</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* My donations */}
        {myDonations.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold font-display">My Donations</h2>
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              {myDonations.map((d: any) => (
                <div key={d._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{d.report?.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()} · {d.report?.location?.city}</p>
                  </div>
                  <span className="font-bold text-secondary">₹{d.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, ROLE_HOME, AppRole } from "../context/AuthContext";
import { toast } from "sonner";

const roles = [
  { value: "citizen", label: "Citizen", desc: "Report & track community issues" },
  { value: "volunteer", label: "Volunteer", desc: "Help solve problems on the ground" },
  { value: "ngo", label: "NGO / Org", desc: "Verify reports & coordinate response" },
  { value: "donor", label: "Donor", desc: "Fund verified community solutions" },
];

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    name: "", email: "", password: "", 
    role: "citizen" as AppRole, 
    location: "", 
    preferredContribution: "time" as "time" | "money" | "both",
    orgName: "", 
    registrationNumber: "" 
  });
  const [message, setMessage] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(ROLE_HOME[form.role] || "/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await register(form);
      toast.success("Account created successfully!");
      navigate(ROLE_HOME[form.role] || "/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  if (message) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-4xl">📧</div>
        <h1 className="text-2xl font-bold font-display">Check your inbox!</h1>
        <p className="text-muted-foreground">{message}</p>
        <button onClick={() => { setMessage(""); setMode("login"); }} className="btn-primary w-full">Back to Login</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/20 via-background to-secondary/10 flex-col justify-between p-12 border-r border-border">
        <Link to="/" className="text-2xl font-bold font-display text-gradient">CommUnity AI</Link>
        <div className="space-y-6">
          <h2 className="text-4xl font-bold font-display leading-tight">Real Problems.<br /><span className="text-gradient">Real Solutions.</span></h2>
          <p className="text-muted-foreground text-lg">AI-verified community reports, coordinated NGO response, transparent impact tracking.</p>
          <div className="grid grid-cols-2 gap-3">
            {[["🏘️", "5,200+", "Reports Filed"], ["✅", "3,800+", "Issues Resolved"], ["🤝", "1,200+", "Volunteers"], ["💰", "₹48L+", "Funds Raised"]].map(([icon, num, label]) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xl font-bold font-display">{num}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground text-sm">Powered by AI · Driven by community</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <Link to="/" className="text-2xl font-bold font-display text-gradient">CommUnity AI</Link>
          </div>

          <div className="flex bg-muted rounded-xl p-1 gap-1">
            {(["login", "register"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-card text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" className="input-field" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <input type="password" value={form.password} onChange={set("password")} required placeholder="••••••••" className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Signing in…" : "Sign In"}
              </button>
              <button type="button" onClick={() => setMode("forgot")} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
                Forgot password?
              </button>
            </form>
          )}

          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Full Name</label>
                <input value={form.name} onChange={set("name")} required placeholder="Your full name" className="input-field" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" className="input-field" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <input type="password" value={form.password} onChange={set("password")} required minLength={8} placeholder="Min 8 characters" className="input-field" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Your City / Location</label>
                <input value={form.location} onChange={set("location")} required placeholder="e.g. Mumbai, Maharashtra" className="input-field" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">I am a…</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button key={r.value} type="button" onClick={() => setForm((f) => ({ ...f, role: r.value as AppRole }))}
                      className={`p-3 rounded-xl border text-left transition-all ${form.role === r.value ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"}`}>
                      <div className="font-semibold text-sm">{r.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {form.role === "volunteer" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">What can you provide?</label>
                  <div className="flex gap-2">
                    {(["time", "money", "both"] as const).map((v) => (
                      <button key={v} type="button" onClick={() => setForm((f) => ({ ...f, preferredContribution: v }))}
                        className={`flex-1 py-2 rounded-lg border text-xs font-semibold capitalize transition-all ${form.preferredContribution === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.role === "ngo" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Org Name</label>
                    <input value={form.orgName} onChange={set("orgName")} placeholder="NGO name" className="input-field" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Reg Number</label>
                    <input value={form.registrationNumber} onChange={set("registrationNumber")} placeholder="Reg ID" className="input-field" />
                  </div>
                </div>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <ForgotPasswordForm onBack={() => setMode("login")} />
          )}
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register: _r, ..._ } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const { authAPI } = await import("../services/api");
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  if (sent) return (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">If that email exists, a reset link has been sent. Check your inbox.</p>
      <button onClick={onBack} className="btn-primary w-full">Back to Login</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link.</p>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="input-field" />
      <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Sending…" : "Send Reset Link"}</button>
      <button type="button" onClick={onBack} className="w-full text-sm text-muted-foreground hover:text-foreground">← Back to login</button>
    </form>
  );
}
import { Link } from "react-router-dom";

const stats = [
  { num: "5,200+", label: "Reports Filed" },
  { num: "3,800+", label: "Issues Resolved" },
  { num: "1,200+", label: "Active Volunteers" },
  { num: "₹48L+", label: "Funds Mobilized" },
];

const roles = [
  { icon: "🏘️", title: "Citizens", desc: "Report community problems with photos and location. Track resolution in real-time.", color: "from-primary/20" },
  { icon: "🏢", title: "NGOs", desc: "Receive AI-verified reports, coordinate field response, and update resolution status.", color: "from-blue-500/20" },
  { icon: "🤝", title: "Volunteers", desc: "Browse verified tasks in your area and sign up to help solve real problems.", color: "from-secondary/20" },
  { icon: "💰", title: "Donors", desc: "Fund verified, transparent community projects and track your real-world impact.", color: "from-purple-500/20" },
];

const steps = [
  { n: "01", title: "Report", desc: "A citizen files a problem with description, location, and optional photos." },
  { n: "02", title: "AI Verify", desc: "Our AI analyzes the report, assigns confidence score, and suggests actions." },
  { n: "03", title: "NGO Review", desc: "Verified NGOs review, confirm, and begin coordinating a response." },
  { n: "04", title: "Resolve", desc: "Volunteers mobilize, donors fund, and the issue gets solved — transparently." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold font-display text-gradient">CommUnity AI</span>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
            <Link to="/auth" className="btn-primary text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-sm font-medium text-primary">
            🤖 AI-Powered Community Impact Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-display leading-none tracking-tight">
            Detect, Verify &<br /><span className="text-gradient">Solve Real Problems</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Citizens report. AI verifies. NGOs coordinate. Volunteers act. Donors fund. Together we build better communities — transparently.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/auth" className="btn-primary text-base py-3 px-8">Start Reporting →</Link>
            <Link to="/auth" className="btn-secondary text-base py-3 px-8">Join as Volunteer</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold font-display text-gradient">{s.num}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display">One Platform, Four Roles</h2>
            <p className="text-muted-foreground mt-3">Everyone plays a part in solving community problems</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((r) => (
              <div key={r.title} className={`bg-card border border-border rounded-2xl p-6 bg-gradient-to-br ${r.color} to-transparent hover:border-primary/40 transition-colors`}>
                <div className="text-4xl mb-4">{r.icon}</div>
                <h3 className="text-lg font-bold font-display">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-card/30 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                {i < steps.length - 1 && <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -translate-x-1/2" />}
                <div className="text-5xl font-bold font-display text-primary/20 mb-3">{s.n}</div>
                <h3 className="font-bold font-display text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold font-display">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground text-lg">Join thousands of changemakers building better communities together.</p>
          <Link to="/auth" className="btn-primary text-base py-4 px-10 inline-block">Join CommUnity AI →</Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © 2025 CommUnity AI · Real Impact, Verified by AI
      </footer>
    </div>
  );
}
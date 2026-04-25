import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavItem { label: string; href: string; icon: string }

interface Props {
  title: string;
  navItems: NavItem[];
  children: ReactNode;
  role: string;
}

const roleColors: Record<string, string> = {
  admin: "text-red-400", ngo: "text-blue-400",
  volunteer: "text-secondary", citizen: "text-primary", donor: "text-purple-400",
};

export default function DashboardLayout({ title, navItems, children, role }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/auth"); };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b border-border">
          <Link to="/" className="text-xl font-bold font-display text-gradient">CommUnity AI</Link>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium truncate max-w-36">{user?.name}</p>
              <p className={`text-xs font-semibold capitalize ${roleColors[role] || "text-muted-foreground"}`}>{role}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              <span className="text-base">{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted">☰</button>
            <h1 className="text-lg font-bold font-display">{title}</h1>
          </div>
          {["citizen","ngo","volunteer","admin"].includes(role) && (
            <Link to="/reports/new" className="btn-primary text-sm py-2 px-4 hidden sm:block">+ New Report</Link>
          )}
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}
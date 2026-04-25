import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth, ROLE_HOME } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./pages/AdminDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import NewReport from "./pages/NewReport";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allow }: { children: React.ReactNode; allow?: string[] }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to={ROLE_HOME[user.role]} replace />;
  return <>{children}</>;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return <Navigate to={ROLE_HOME[user.role]} replace />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute allow={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/ngo-dashboard" element={<ProtectedRoute allow={["ngo"]}><NgoDashboard /></ProtectedRoute>} />
            <Route path="/volunteer-dashboard" element={<ProtectedRoute allow={["volunteer"]}><VolunteerDashboard /></ProtectedRoute>} />
            <Route path="/citizen-dashboard" element={<ProtectedRoute allow={["citizen"]}><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/donor-dashboard" element={<ProtectedRoute allow={["donor"]}><DonorDashboard /></ProtectedRoute>} />
            <Route path="/reports/new" element={<ProtectedRoute allow={["citizen","ngo","volunteer","admin"]}><NewReport /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
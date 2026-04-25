import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth, ROLE_HOME, AppRole } from "../context/AuthContext";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { setStatus("error"); setMessage("No verification token found."); return; }

    authAPI.verifyEmail(token)
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        setStatus("success");
        setTimeout(() => navigate(ROLE_HOME[data.role as AppRole] || "/dashboard"), 2000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The link may have expired.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <h1 className="text-2xl font-bold font-display">Verifying your email…</h1>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-4xl">✅</div>
            <h1 className="text-2xl font-bold font-display">Email Verified!</h1>
            <p className="text-muted-foreground">Welcome to CommUnity AI. Redirecting to your dashboard…</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto text-4xl">❌</div>
            <h1 className="text-2xl font-bold font-display">Verification Failed</h1>
            <p className="text-muted-foreground">{message}</p>
            <a href="/auth" className="btn-primary inline-block">Back to Login</a>
          </>
        )}
      </div>
    </div>
  );
}
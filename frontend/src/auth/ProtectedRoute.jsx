import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "./AuthContext";

const PILARGROUP_URL = import.meta.env.VITE_PILARGROUP_URL || "https://pilargroup.id";
const APP_KEY = "framelens";

export default function ProtectedRoute({ children }) {
  const { user, loading, redirectToLogin } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Belum login → ke login pg dengan return_url
      redirectToLogin();
      return;
    }

    // Login tapi gak punya akses FL → ke dashboard pg, tanpa return_url
    if (!user.apps?.includes(APP_KEY)) {
      window.location.href = `${PILARGROUP_URL}/dashboard`;
    }
  }, [loading, user, redirectToLogin]);

  if (loading || !user || !user.apps?.includes(APP_KEY)) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background: "#f4f6fb",
        }}
      >
        <CircularProgress size={36} sx={{ color: "#233971" }} />
        <Typography sx={{ fontFamily: "'Sora', sans-serif", fontSize: "0.875rem", color: "#64748b" }}>
          {loading ? "Memverifikasi sesi..." : "Mengarahkan..."}
        </Typography>
      </Box>
    );
  }

  return children;
}
import { useEffect, useState } from "react"
import { Box, CircularProgress, Typography } from "@mui/material"
import { useAuth } from "./AuthContext"
import { autoInjectMockAuth, isMockAuthEnabled } from "../utils/mockAuth"

const PILARGROUP_URL = import.meta.env.VITE_PILARGROUP_URL || "https://pilargroup.id"
const APP_KEY = "framelens"

export default function ProtectedRoute({ children }) {
  const { user, loading, redirectToLogin } = useAuth()
  const [mockLoading, setMockLoading] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      if (isMockAuthEnabled()) {
        setMockLoading(true)
        autoInjectMockAuth().then((success) => {
          if (success) {
            window.location.reload()
          } else {
            console.error('[ProtectedRoute FL] Mock auth gagal')
            setMockLoading(false)
          }
        })
        return
      }

      redirectToLogin()
      return
    }

    if (!user.apps?.includes(APP_KEY)) {
      window.location.href = `${PILARGROUP_URL}/dashboard`
    }
  }, [loading, user, redirectToLogin])

  if (loading || mockLoading || !user || !user.apps?.includes(APP_KEY)) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
        <CircularProgress size={36} sx={{ color: "#4F46E5" }} />
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "rgba(14,60,110,0.5)" }}>
          {loading || mockLoading ? "Memverifikasi sesi..." : "Mengarahkan..."}
        </Typography>
      </Box>
    )
  }

  return children
}
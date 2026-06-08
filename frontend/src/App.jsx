import { BrowserRouter, Routes, Route } from "react-router-dom"
import Gallery from "./pages/Gallery"
import ImageEditorPage from "./pages/ImageEditorPage"
import PromptBuilderPage from "./pages/PromptBuilderPage"
import PromptBuilderGTPage from "./pages/PromptBuilderGTPage"
import Layout from "./components/Layout"
import { AuthProvider, useAuth } from "./auth/AuthContext"
import ProtectedRoute from "./auth/ProtectedRoute"
import { useSessionGuard } from "./hooks/useSessionGuard"

function AppRoutes() {
  const { logout } = useAuth()

  useSessionGuard(() => {
    logout()
    const returnUrl = encodeURIComponent(window.location.origin)
    window.location.href = `${import.meta.env.VITE_PILARGROUP_URL}?return_url=${returnUrl}`
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Gallery />} />
          <Route path="/image-editor" element={<ImageEditorPage />} />
          <Route path="/prompt-builder" element={<PromptBuilderPage />} />
          <Route path="/prompt-builder-gt" element={<PromptBuilderGTPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppRoutes />
      </ProtectedRoute>
    </AuthProvider>
  )
}

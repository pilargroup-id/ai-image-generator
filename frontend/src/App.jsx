import { BrowserRouter, Routes, Route } from "react-router-dom"
import Gallery from "./pages/Gallery"
import ImageEditorPage from "./pages/ImageEditorPage"
import Layout from "./components/Layout"
import { AuthProvider, useAuth } from "./auth/AuthContext"
import ProtectedRoute from "./auth/ProtectedRoute"
import { useSessionGuard } from "./hooks/useSessionGuard"  // ← tambah

function AppRoutes() {
  const { logout } = useAuth()

  // ← tambah
  useSessionGuard(() => {
    logout()
    const returnUrl = encodeURIComponent(window.location.origin)
    window.location.href = `${import.meta.env.VITE_PILARGROUP_URL}?return_url=${returnUrl}`
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout pageTitle="Gallery" pageSubtitle="Hasil generate tersimpan di server">
              <Gallery />
            </Layout>
          }
        />
        <Route
          path="/image-editor"
          element={
            <Layout pageTitle="Image Editor" pageSubtitle="Edit gambar dengan AI">
              <ImageEditorPage />
            </Layout>
          }
        />
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
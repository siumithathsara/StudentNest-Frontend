import type { ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import AdminPage from "../pages/AdminPage"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import type { Role } from "../types"

type RequireAuthTypes = {
  children: ReactNode
  roles?: Role[]
}

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth()

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-nest-700">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-dashed border-sand-400"></div>
      </div>
    )

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="px-6 py-20 text-center">
        <h2 className="mb-2 text-xl font-bold text-sand-100">Access denied</h2>
        <p className="text-nest-300">You do not have permission to view this page.</p>
      </div>
    )
  }
  return <>{children}</>
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        {/* ADMIN පමණයි */}
        <Route
          path="/admin"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <AdminPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
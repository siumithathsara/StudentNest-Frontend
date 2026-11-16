import type { ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import AdminPage from "../pages/AdminPage"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import type { Role } from "../types"
import AdminUsers from "../pages/AdminUsers"
import AdminBoardings from "../pages/AdminBoardings"
import AdminCampuses from "../pages/AdminCampuses"
import BoardingForm from "../pages/BoardingForm"
import MyBoardings from "../pages/MyBoardings"
import BoardingDetail from "../pages/BoardingDetail"
import Boardings from "../pages/Boardings"
import Compare from "../pages/Compare"
import Favorites from "../pages/Favorites"
import MyBookings from "../pages/MyBookings"
import OwnerBookings from "../pages/OwnerBookings"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <AdminUsers />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/boardings"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <AdminBoardings />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/campuses"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <AdminCampuses />
            </RequireAuth>
          }
        />

        <Route
          path="/owner/boardings"
          element={
            <RequireAuth roles={["OWNER"]}>
              <MyBoardings />
            </RequireAuth>
          }
        />
        <Route
          path="/owner/boardings/new"
          element={
            <RequireAuth roles={["OWNER"]}>
              <BoardingForm />
            </RequireAuth>
          }
        />
        <Route
          path="/owner/boardings/:id/edit"
          element={
            <RequireAuth roles={["OWNER"]}>
              <BoardingForm />
            </RequireAuth>
          }
        />

        <Route
          path="/owner/bookings"
          element={
            <RequireAuth roles={["OWNER"]}>
              <OwnerBookings />
            </RequireAuth>
          }
        />

        <Route
          path="/boardings"
          element={
            <RequireAuth roles={["STUDENT"]}>
              <Boardings />
            </RequireAuth>
          }
        />
        <Route
          path="/boardings/:id"
          element={
            <RequireAuth roles={["STUDENT"]}>
              <BoardingDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/favorites"
          element={
            <RequireAuth roles={["STUDENT"]}>
              <Favorites />
            </RequireAuth>
          }
        />
        <Route
          path="/compare"
          element={
            <RequireAuth roles={["STUDENT"]}>
              <Compare />
            </RequireAuth>
          }
        />

        <Route
          path="/bookings"
          element={
            <RequireAuth roles={["STUDENT"]}>
              <MyBookings />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import React from "react"

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )

  return (user?.role === "admin" || user?.role === "moderator")
    ? children
    : <Navigate to="/" replace />
}

export default AdminRoute

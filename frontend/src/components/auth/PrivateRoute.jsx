import { Navigate } from "react-router-dom"
import React from "react"
import { useAuth } from "../../context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" />
}

export default PrivateRoute

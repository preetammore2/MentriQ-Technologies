import React, { createContext, useContext, useReducer, useEffect } from "react";
import { apiClient } from "../utils/apiClient";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case "SET_ENROLLMENTS_STATUS":
      return { ...state, hasEnrollments: action.payload };

    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        hasEnrollments: false,
      };

    case "OPEN_AUTH_MODAL":
      return { ...state, isAuthModalOpen: true };

    case "CLOSE_AUTH_MODAL":
      return { ...state, isAuthModalOpen: false };


    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    hasEnrollments: false,
    isAuthModalOpen: false,
  });


  const loadUser = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      dispatch({ type: "LOGOUT" });
      return;
    }

    try {
      const res = await apiClient.get("/auth/me");
      dispatch({ type: "AUTH_SUCCESS", payload: res.data.user });
      await checkEnrollments();
    } catch {
      sessionStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
    }
  };

  const checkEnrollments = async () => {
    try {
      const res = await apiClient.get("/enrollments/my");
      dispatch({ type: "SET_ENROLLMENTS_STATUS", payload: res.data.length > 0 });
      return res.data.length > 0;
    } catch {
      dispatch({ type: "SET_ENROLLMENTS_STATUS", payload: false });
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      sessionStorage.setItem("token", res.data.token);
      await loadUser();
      return { success: true, user: res.data.user };
    } catch (error) {
      console.error("Login call failed:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await apiClient.post("/auth/register", { name, email, password });
      sessionStorage.setItem("token", res.data.token);
      await loadUser();
      return { success: true, user: res.data.user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Register failed",
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    }
    sessionStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    localStorage.removeItem("token");
    loadUser();
  }, []);

  const openAuthModal = () => dispatch({ type: "OPEN_AUTH_MODAL" });
  const closeAuthModal = () => dispatch({ type: "CLOSE_AUTH_MODAL" });

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        checkEnrollments,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  if (!loggedUser) return <Navigate to="/login" replace />; // login qilmagan bo‘lsa
  if (role && loggedUser.role !== role) return <Navigate to="/" replace />; // roli mos kelmasa

  return children;
}

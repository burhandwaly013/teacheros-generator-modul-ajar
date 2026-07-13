import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "./AuthProvider";

/**
 * Auth Guard untuk seluruh route Workspace TeacherOS. Tidak memiliki
 * logic login/logout — murni membaca status isLoggedIn dari AuthContext
 * dan memutuskan apakah route anak boleh dirender atau harus diarahkan
 * ke halaman login.
 */
export function ProtectedRoute() {
  const { isLoggedIn } = useAuthContext();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
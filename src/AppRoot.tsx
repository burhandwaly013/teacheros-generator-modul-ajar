import Dashboard from "./dashboard-v2/Dashboard";
import LoginPage from "./auth/LoginPage";
import { useAuth } from "./auth/useAuth";

export default function AppRoot() {
  const { isLoggedIn, login, logout } = useAuth();

  if (!isLoggedIn) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <Dashboard
      onLogout={logout}
    />
  );
}
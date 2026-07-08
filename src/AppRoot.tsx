import App from "./App";
import LoginPage from "./auth/LoginPage";
import { useAuth } from "./auth/useAuth";

export default function AppRoot() {
  const { isLoggedIn, login, logout } = useAuth();

  if (!isLoggedIn) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <App
      onLogout={logout}
    />
  );
}
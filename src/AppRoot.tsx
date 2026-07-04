import App from "./App";
import LoginPage from "./auth/LoginPage";
import { useAuth } from "./auth/useAuth";

/**
 * Gerbang autentikasi. Komponen ini SENGAJA tidak mengandung logika
 * Generator Modul Ajar apa pun — App.tsx tetap persis seperti sebelumnya,
 * tidak diubah sama sekali. Tombol Logout dirender di sini sebagai elemen
 * mengambang terpisah, bukan bagian dari App.tsx.
 */
export default function AppRoot() {
  const { isLoggedIn, login, logout } = useAuth();

  if (!isLoggedIn) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <>
      <button
        onClick={logout}
        className="no-print fixed top-3 right-3 z-50 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition"
      >
        🚪 Logout
      </button>
      <App />
    </>
  );
}
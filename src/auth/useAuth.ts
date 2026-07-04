import { useCallback, useState } from "react";
import { loginRequest } from "./authApi";
import type { LoginResponse } from "./authApi";

const KEY_LOGGED_IN = "teacheros_logged_in";
const KEY_USER = "teacheros_user";

function readStoredUser(): LoginResponse | null {
  try {
    const loggedIn = localStorage.getItem(KEY_LOGGED_IN);
    const userRaw = localStorage.getItem(KEY_USER);
    if (loggedIn === "true" && userRaw) {
      return JSON.parse(userRaw) as LoginResponse;
    }
  } catch {
    // localStorage tidak tersedia atau datanya korup — anggap belum login
  }
  return null;
}

/**
 * Hook sesi login. Sesi disimpan di localStorage (teacheros_logged_in,
 * teacheros_user) supaya bertahan saat browser di-refresh, sesuai
 * permintaan. Tidak ada logika Generator Modul Ajar di sini sama sekali —
 * modul ini murni gerbang autentikasi.
 */
export function useAuth() {
  const [user, setUser] = useState<LoginResponse | null>(() => readStoredUser());

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    if (result.success) {
      localStorage.setItem(KEY_LOGGED_IN, "true");
      localStorage.setItem(KEY_USER, JSON.stringify(result));
      setUser(result);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY_LOGGED_IN);
    localStorage.removeItem(KEY_USER);
    setUser(null);
  }, []);

  return { isLoggedIn: !!user, user, login, logout };
}
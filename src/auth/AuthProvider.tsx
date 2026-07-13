import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";

type AuthContextValue = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Membungkus useAuth() menjadi satu sumber kebenaran (single source of
 * truth) untuk status autentikasi di seluruh TeacherOS. Tidak ada logic
 * login/logout di sini — seluruhnya didelegasikan ke useAuth().
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Hook untuk mengonsumsi AuthContext dari komponen mana pun di dalam
 * pohon yang dibungkus AuthProvider. Melempar error jika dipakai di luar
 * AuthProvider, supaya kesalahan pemakaian terdeteksi lebih awal alih-alih
 * gagal secara diam-diam.
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext harus dipakai di dalam <AuthProvider>.");
  }
  return context;
}
import { useState } from "react";
import type { FormEvent } from "react";
import type { LoginResponse } from "./authApi";

export default function LoginPage({
  onLogin,
}: {
  onLogin: (email: string, password: string) => Promise<LoginResponse>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await onLogin(email, password);
      if (!result.success) {
        setError("Email atau Password salah.");
      }
      // Kalau success, komponen induk (AppRoot) yang akan menukar tampilan
      // ke Generator Modul Ajar — tidak ada yang perlu dilakukan di sini.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ fontFamily: "'Inter',sans-serif" }}
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-sm">
        <div className="bg-gradient-to-r from-red-800 to-rose-900 rounded-t-2xl px-6 py-8 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/15 flex items-center justify-center">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
              <line x1="9" y1="15" x2="13" y2="15" />
            </svg>
          </div>
          <p className="text-white/80 text-xs font-semibold tracking-wide uppercase">TeacherOS</p>
          <h1 className="text-white font-bold text-lg mt-1">Generator Modul Ajar</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-2xl shadow-lg border border-gray-100 px-6 py-6"
        >
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="nama@sekolah.belajar.id"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="********"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs font-medium mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 hover:bg-red-900 disabled:bg-red-400 text-white font-semibold text-sm py-2.5 rounded-lg transition"
          >
            {loading ? "Memproses..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
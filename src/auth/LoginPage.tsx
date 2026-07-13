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
      // Kalau success, komponen induk (routing TeacherOS) yang akan
      // menangani perpindahan ke Dashboard — tidak ada yang perlu
      // dilakukan di sini.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      
      className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 flex items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-sm">
        <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-t-3xl px-8 py-10 text-center shadow-xl shadow-violet-600/20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3L2 8l10 5 10-5-10-5z" />
              <path d="M6 10.5V16c0 1 2.5 3 6 3s6-2 6-3v-5.5" />
              <path d="M22 8v6" />
            </svg>
          </div>
          <p className="text-white/75 text-xs font-bold tracking-wider uppercase mb-1">
            Workspace Digital Guru Indonesia
          </p>
          <h1 className="text-white font-extrabold text-2xl tracking-tight">TeacherOS</h1>
          <p className="text-white/70 text-xs font-medium mt-2 leading-relaxed">
            Masuk untuk mengakses seluruh aplikasi TeacherOS
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-3xl shadow-xl shadow-slate-900/5 border border-slate-100 px-8 py-8"
        >
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 tracking-wide">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-colors"
              placeholder="nama@sekolah.belajar.id"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 tracking-wide">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-colors"
              placeholder="********"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs font-semibold mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-violet-600/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? "Memproses..." : "Masuk ke TeacherOS"}
          </button>
        </form>
      </div>
    </div>
  );
}
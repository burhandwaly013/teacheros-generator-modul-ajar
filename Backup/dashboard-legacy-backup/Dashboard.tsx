import { useState } from "react";
import App from "../../src/App";
import { MENU_ITEMS } from "./menuItems";
import DashboardHome from "./DashboardHome";
import ComingSoonScreen from "./ComingSoonScreen";
import type { LoginResponse } from "../../src/auth/authApi";
import { dashboardTheme } from "./dashboardTheme";

interface DashboardProps {
  user?: LoginResponse | null;
  onLogout?: () => void;
}

export default function Dashboard({
  user,
  onLogout,
}: DashboardProps) {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  function handleMenuClick(item: (typeof MENU_ITEMS)[number]) {
    // Logout bukan layar, tetapi aksi
    if (item.kind === "action") {
      onLogout?.();
      return;
    }

    setActiveMenu(item.key);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const currentItem =
    MENU_ITEMS.find((m) => m.key === activeMenu) ?? MENU_ITEMS[0];

  return (
    <>
      {/* ===================== */}
      {/* GENERATOR MODUL AJAR */}
      {/* ===================== */}

      <div
        style={{
          display:
            activeMenu === "generator-modul-ajar" ? "block" : "none",
        }}
      >
        <App />

        <button
          onClick={() => setActiveMenu("dashboard")}
          className="fixed top-3 left-3 z-[9999] bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow px-4 py-2 text-sm font-semibold"
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      {/* ===================== */}
      {/* DASHBOARD */}
      {/* ===================== */}

      <div
        style={{
          display:
            activeMenu === "generator-modul-ajar"
              ? "none"
              : "flex",
        }}
        className={`min-h-screen ${dashboardTheme.colors.page}`}
      >
        {/* Sidebar */}

        className={`w-64 ${dashboardTheme.colors.sidebar} border-r ${dashboardTheme.colors.sidebarBorder} flex-shrink-0 ${dashboardTheme.shadow.sidebar}`}

          <div className="px-5 py-5 border-b border-gray-100">

            <h1 className="text-2xl font-black text-white tracking-wide">
              TeacherOS
              <p className="text-xs text-slate-400 mt-1">
                Platform Administrasi Guru Indonesia
            </p>
            </h1>

          </div>

          <nav className="py-2">

            {MENU_ITEMS.map((item) => (

              <button
                key={item.key}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition ${
                  activeMenu === item.key
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />

                <span>{item.label}</span>

              </button>

            ))}

          </nav>

        </aside>

        {/* Content */}

        <main className="flex-1 p-6">

          {activeMenu === "dashboard" ? (

            <DashboardHome user={user} />

          ) : (

            <ComingSoonScreen
              title={currentItem.label}
            />

          )}

        </main>

      </div>
    </>
  );
}
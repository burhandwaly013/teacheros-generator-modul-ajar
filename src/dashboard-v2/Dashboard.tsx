import { useState } from "react";
import App from "../App";

import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import ComingSoonScreen from "./ComingSoonScreen";
import { menuItems } from "./menuItems";

interface DashboardProps {
  onLogout?: () => void;
}

export default function Dashboard({
  onLogout,
}: DashboardProps) {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const currentMenu =
    menuItems.find((m) => m.key === activeMenu) ?? menuItems[0];

  function handleMenuClick(item: (typeof menuItems)[number]) {
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

  /* ======================================================
     GENERATOR MODUL AJAR
  ====================================================== */

  if (activeMenu === "generator-modul-ajar") {
    return (
      <div className="min-h-screen">

        {/* Toolbar */}

        <div className="fixed top-4 left-4 right-4 z-[9999] flex justify-between">

          <button
            onClick={() => setActiveMenu("dashboard")}
            className="bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-lg px-5 py-3 font-semibold transition"
          >
            ← Dashboard
          </button>

          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg px-5 py-3 font-semibold transition"
          >
            🚪 Logout
          </button>

        </div>

        <App />

      </div>
    );
  }

  /* ======================================================
     DASHBOARD
  ====================================================== */

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
      />

      <main className="flex-1 overflow-auto">

        {activeMenu === "dashboard" ? (
          <DashboardHome userName="Guru" />
        ) : (
          <ComingSoonScreen
            title={currentMenu.label}
          />
        )}

      </main>

    </div>
  );
}
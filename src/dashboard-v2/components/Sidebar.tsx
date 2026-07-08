import { menuItems } from "../config/menuItems";
import { dashboardTheme } from "../config/dashboardTheme";

interface SidebarProps {
  activeMenu: string;
  onMenuClick: (item: (typeof menuItems)[number]) => void;
}

export default function Sidebar({
  activeMenu,
  onMenuClick,
}: SidebarProps) {
  return (
    <aside
      className={`
        ${dashboardTheme.layout.sidebarWidth}
        ${dashboardTheme.colors.sidebar}
        text-white
        flex
        flex-col
        flex-shrink-0
        ${dashboardTheme.shadow.sidebar}
      `}
    >
      {/* ================= HEADER ================= */}

      <div className="px-6 py-7 border-b border-slate-800">

        <h1 className="text-3xl font-black tracking-wide">
          {dashboardTheme.app.name}
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          {dashboardTheme.app.slogan}
        </p>

      </div>

      {/* ================= MENU ================= */}

      <nav className="flex-1 py-5 px-3">

        <div className="space-y-1">

          {menuItems.map((item) => {

            const active = activeMenu === item.key;
            const Icon = item.icon;

            return (

              <button
                key={item.key}
                onClick={() => onMenuClick(item)}
                className={`
                  group
                  w-full
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  px-4
                  py-3
                  transition-all
                  duration-300

                  ${
                    active
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                  }
                `}
              >

                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    transition-all
                    duration-300

                    ${
                      active
                        ? "bg-white/15"
                        : "group-hover:bg-slate-700"
                    }
                  `}
                >

                  <Icon
                    size={20}
                    strokeWidth={2}
                  />

                </div>

                <div className="flex flex-col items-start">

                  <span className="font-medium">
                    {item.label}
                  </span>

                  {item.status === "comingSoon" && (
                    <span className="text-[11px] text-amber-400">
                      Segera Hadir
                    </span>
                  )}

                </div>

              </button>

            );

          })}

        </div>

      </nav>

      {/* ================= FOOTER ================= */}

      <div className="border-t border-slate-800 px-6 py-5">

        <p className="text-sm font-semibold text-slate-300">
          TeacherOS
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Dashboard V3 Foundation
        </p>

        <p className="mt-3 text-xs text-slate-600">
          AI Powered Teaching Platform
        </p>

      </div>

    </aside>
  );
}